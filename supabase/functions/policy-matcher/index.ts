import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PolicyInput {
  id: string;
  title: string;
  category: string;
  description: string;
  localizedExample?: string;
}

interface MatchResult {
  policyId: string;
  score: number; // 0-1
  reason: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'OPENROUTER_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { query, policies, maxResults = 6 } = body as { query: string; policies: PolicyInput[]; maxResults?: number };

    if (!query || !Array.isArray(policies)) {
      return new Response(
        JSON.stringify({ error: 'Invalid payload. Expected { query, policies[] }' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const categorySet = Array.from(new Set((policies as PolicyInput[]).map(p => p.category))).sort();

    const systemPrompt = `You are Winston Jordan's policy matching assistant for NJ-12. Given a user query and a list of policies, return the most semantically relevant policies.

CONTEXT ANALYSIS RULES:
- "Gay rights" and related terms map to LGBTQ+ equality, anti-discrimination protections, marriage equality, civil rights protections.
- "Healthcare" = medical access, Medicare/Medicaid, insurance, mental health.
- "Economy" = jobs, wages, small business, unions, financial protections.
- "Climate/Environment" = clean energy, flooding, heat, sustainability.
- Prefer matches that align with the user's intent over shallow keyword overlaps like the word "rights" (avoid mapping LGBTQ rights to "voting rights").

CATEGORIES:
${categorySet.join('\n')}

STRICT OUTPUT FORMAT:
Return ONLY a compact JSON object with this exact shape and no extra commentary:
{"relevantPolicies": [{"policyId": "ID", "score": 0.0, "reason": "short explanation"}, ...]}`;

    const userContent = {
      query,
      policies,
      instructions: `Rank up to ${maxResults} policies by semantic relevance. Score between 0 and 1. Avoid unrelated categories even if keywords overlap.`
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://policy.winstonforcongress.com',
        'X-Title': 'Winston Policy Matcher',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-70b-instruct:floor',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(userContent) }
        ],
        temperature: 0.2,
        max_tokens: 400,
        stream: false,
        provider: {
          sort: 'price',
          max_price: { prompt: 1.0, completion: 2.0 },
          allow_fallbacks: true,
          quantizations: ['fp8', 'fp16', 'bf16']
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[policy-matcher] OpenRouter API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `OpenRouter API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? '';

    // Try to parse JSON from the assistant content
    let parsed: { relevantPolicies?: MatchResult[] } = {};
    try {
      // If content contains backticks or extra text, extract the JSON block
      const jsonMatch = typeof content === 'string' ? content.match(/\{[\s\S]*\}/) : null;
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      console.error('[policy-matcher] Failed to parse JSON content:', content);
      return new Response(
        JSON.stringify({ relevantPolicies: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let relevantPolicies = (parsed.relevantPolicies || [])
      .filter((m) => typeof m.policyId === 'string')
      .slice(0, maxResults);

    // Basic sanity checks and clipping
    relevantPolicies = relevantPolicies.map((m) => ({
      policyId: m.policyId,
      score: Math.max(0, Math.min(1, Number(m.score) || 0)),
      reason: String(m.reason || 'Relevant'),
    }));

    console.log('[policy-matcher] Matched', relevantPolicies.length, 'policies for query:', query);

    return new Response(
      JSON.stringify({ relevantPolicies }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[policy-matcher] Error:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});