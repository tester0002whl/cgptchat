import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    let { messages, model = "meta-llama/llama-3.1-70b-instruct:floor" } = body;
    const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

    if (!openRouterApiKey) {
      console.error('OPENROUTER_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Simple guardrails + moderation check
    const lastUserContent = Array.isArray(messages)
      ? (messages.slice().reverse().find((m: any) => m?.role === 'user')?.content ?? '')
      : '';

    const badPatterns = [
      /\b(is|was)\s+[^?!.]*\s+(criminal|felon|fraud|corrupt)\b/i,
      /\b(sc(am|ammer)|liar)\b/i,
      /\b(pedophile|traitor|terrorist)\b/i,
      /\bkill|violence\b/i,
      /\b(is|was)\s+[^?!.]*\s+(gay|lesbian|bisexual|straight|trans|transgender)\b/i,
      /\b(married|single|dating|girlfriend|boyfriend|wife|husband)\b/i,
      /\b(personal|private)\s+(life|relationship|family)\b/i,
    ];
    const isBadFaith = typeof lastUserContent === 'string' && badPatterns.some((r) => r.test(lastUserContent));

    if (isBadFaith) {
      console.warn('[MODERATION] Flagged user query:', lastUserContent);
      const deflection = "I'm here to discuss Winston's policy positions for NJ-12. I can't engage with allegations, personal attacks and non-policy discourse. Would you like info on his accountability pledges or a specific policy area?";
      return new Response(
        JSON.stringify({
          choices: [ { message: { content: deflection } } ],
          moderationFlagged: true,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Inject guardrail system prompt
    messages = [
      { role: 'system', content: 'Guardrails: Stay policy-focused. If asked about allegations or personal attacks, decline and redirect to policies. Avoid making unverified claims about individuals. Be civil and constructive.' },
      ...messages,
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://policy.winstonforcongress.com',
        'X-Title': 'Winston for Congress Policy Assistant',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 500,
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
      console.error('OpenRouter API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `OpenRouter API error: ${response.status}` }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    console.log('OpenRouter response received successfully');

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-ai function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});