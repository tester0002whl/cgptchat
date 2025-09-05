import { useState, useRef, useEffect } from "react";
import { policies } from "@/data/policies";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PolicyChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Policy = typeof policies[number];

interface RelatedPolicy {
  policy: Policy;
  reason: string;
}

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  relatedPolicies?: RelatedPolicy[];
  moderationFlagged?: boolean;
  feedback?: {
    topicRating?: number;
    agreesWithPolicies?: boolean;
    comment?: string;
  };
  fromPolicyTile?: boolean;
  policyTitle?: string;
}

export function PolicyChat({ open, onOpenChange }: PolicyChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi! I'm here to help you understand Winston Jordan's policy platform. Ask me about any policy area like healthcare, education, economic guarantees, environmental protection, or AI-driven worker displacement. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const MAX_CHAT_INPUT_LENGTH = 300;
  const MAX_FEEDBACK_COMMENT_LENGTH = 300;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatAIResponse = (rawText: string): string => {
    const paragraphs = rawText.split('\n\n').map(p => p.trim()).filter(p => p);
    const formattedParagraphs = paragraphs.map(paragraph => {
      const lines = paragraph.split('\n').map(line => line.trim());
      const isList = lines.every(line => line.match(/^[-*]|^[0-9]+\./));
      if (isList) {
        return lines.map(line => {
          if (line.startsWith('*') || line.startsWith('-')) {
            return `- ${line.slice(1).trim()}`;
          }
          if (line.match(/^[0-9]+\./)) {
            return `${line.match(/^[0-9]+/)}: ${line.replace(/^[0-9]+\.\s*/, '')}`;
          }
          return line;
        }).join('\n');
      }
      return paragraph.replace(/\n/g, ' ').trim();
    });
    return formattedParagraphs.join('\n\n');
  };

  const generateAIResponse = async (userMessage: string, policySummary: string, relatedPolicies: RelatedPolicy[], policyTitle?: string): Promise<{ text: string; moderationFlagged?: boolean }> => {
    const categoryContext = `
WINSTON'S 21 POLICY CATEGORIES:
1. Mission & Accountability - Zero-donor campaign, direct democracy, term commitment
2. Direct Democracy - 24/7 digital townhall, real-time constituent voting, transparency
3. Legislative Renewal - Repeal harmful laws, direct compensation, enforce founding promise
4. Economic Development & Jobs - Small business support, infrastructure investment, college affordability
5. Healthcare Access - Medicare/Medicaid expansion, local hospital support, mental health services
6. Cost of Living Relief - Property tax relief, Social Security expansion, utility oversight
7. Transportation - NJ Transit reliability, safer roads, EV charging, climate resilience
8. Environmental Protection - Clean energy incentives, waterway protection, green jobs
9. Economic Guarantees - Fair wages, small business expansion, infrastructure jobs, financial protections, human dignity income
10. Healthcare & Public Health - Single-payer Medicare-for-All, drug price caps, reproductive health
11. Education & Opportunity - Teacher pay increases, K-12 funding protection, Pre-K expansion
12. Democracy & Government Reform - Voting rights, redistricting reform, Citizens United repeal
13. Public Safety & Wellbeing - Mental health crisis response, gun violence prevention, community policing
14. Sustainable Future - Clean energy jobs, utility bill reduction, pollution enforcement
15. Digital Equity - Broadband access, digital literacy programs, tech workforce development
16. Veterans & Institutions - VA healthcare, veteran services, institutional accountability
17. Housing & Family Support - Affordable housing initiatives, family leave policies, renter protections
18. Proven Models - Evidence-based policy implementation, successful program replication
19. Foreign Policy - Diplomacy-first approach, end endless wars, two-state solution support
20. Institutional Restoration & Accountability - Government transparency, corruption prevention
21. Civil Rights & Equality - Equal protection, anti-discrimination enforcement, justice reform`;

    const systemPrompt = `You are Winston Jordan's campaign policy assistant for New Jersey's 12th Congressional District.

${categoryContext}

CORE PRINCIPLES:
- Zero-donor, people-powered campaign
- Direct democracy through district polling guides votes
- Focus on NJ-12 specific examples across Union, Somerset, Mercer, and Middlesex counties (Trenton, New Brunswick, Princeton, Plainfield, Somerville, East Brunswick, etc.)
- Comprehensive progressive platform with measurable outcomes
- Forward-looking vision to ensure human dignity through shared prosperity, addressing AI and robotics-driven worker displacement

${policyTitle ? `SPECIFIC POLICY QUERY: The user is asking about "${policyTitle}". Provide a detailed explanation of this policy, including its description, goals, and any NJ-12 specific examples.` : `CURRENT QUERY CONTEXT: ${policySummary}`}

RELATED POLICIES: ${relatedPolicies.map(rp => `${rp.policy.title}: ${rp.policy.description} (${rp.reason})`).join('\n')}

CRITICAL RESPONSE GUIDELINES:
- If a specific policy title is provided, focus EXCLUSIVELY on that policy's details.
- STAY FOCUSED on the specific topic being asked about
- For LOCAL NJ-12 questions, stick to LOCAL policies only - do not drift into unrelated national/foreign policy topics
- Use specific NJ-12 examples when available (Bound Brook flooding, Manville retrofits, etc.)
- If asked about climate/flooding in NJ-12, focus ONLY on environmental protection and sustainable future policies
- For AI/automation displacement queries, emphasize the Human Dignity Income policy: taxing corporations to fund income for displaced workers, ensuring shared prosperity
- Do not connect unrelated policy areas unless directly relevant
- Keep responses grounded, practical, and measured - avoid hyperbolic language
- Do not invent or exaggerate policies beyond what's documented
- If information isn't available, say so clearly rather than improvising
- Format responses in Markdown for clarity:
  - Use paragraphs separated by blank lines
  - Use bullet points (- ) for lists
  - Use numbered lists (1. ) for steps or ranked items
  - Ensure proper indentation and spacing`;

    const response = await supabase.functions.invoke('chat-ai', {
      body: {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ]
      }
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    const rawContent = response.data?.choices?.[0]?.message?.content ?? '';
    const formattedContent = formatAIResponse(rawContent);
    const moderationFlagged = !!response.data?.moderationFlagged;
    return { text: formattedContent, moderationFlagged };
  };

  const lastBotMessageRef = useRef<HTMLDivElement>(null);

  const scrollToLatestBotMessage = () => {
    if (lastBotMessageRef.current) {
      lastBotMessageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [lastMessageCount, setLastMessageCount] = useState(messages.length);
  
  useEffect(() => {
    if (messages.length > lastMessageCount || isTyping) {
      scrollToLatestBotMessage();
      setLastMessageCount(messages.length);
    }
  }, [messages.length, isTyping, lastMessageCount]);

  const updateMessageFeedback = (messageId: string, feedback: Partial<Message['feedback']>) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, feedback: { ...msg.feedback, ...feedback } }
        : msg
    ));
  };

  const normalizeCategory = (c: string) => (c === "Economic Opportunity" ? "Economic Guarantees" : c);

  const STOP_WORDS = new Set<string>([
    'the','and','for','about','what','which','this','that','these','those','with','have','has','had','are','is','was','were','be','being','been','on','in','of','to','from','by','at','as','it','its','an','a','or','if','but','can','could','should','would','do','does','did','you','your','yours','me','my','we','our','us','they','their','them','policy','policies','tell','more','question','ask','asks','asking',
    'support','supports','supporting','oppose','opposes','opposing','favor','favors','back','backs','endorse','endorses','endorsing'
  ]);

  let POLICY_TERMS: Set<string> | null = null;
  const buildPolicyTerms = () => {
    if (POLICY_TERMS) return POLICY_TERMS;
    const set = new Set<string>();
    for (const p of policies) {
      const add = (s?: string) => {
        if (!s) return;
        s.toLowerCase().split(/[^a-z0-9]+/).forEach(w => {
          if (w && w.length > 2 && !STOP_WORDS.has(w)) set.add(w);
        });
      };
      add(p.title);
      add(p.category);
      add(p.description);
      add(p.localizedExample);
    }
    POLICY_TERMS = set;
    return set;
  };

  const toBigrams = (arr: string[]) => {
    const res: string[] = [];
    for (let i = 0; i < arr.length - 1; i++) res.push(`${arr[i]} ${arr[i+1]}`);
    return res;
  };

  const findRelevantPolicies = (query: string, policyTitle?: string): RelatedPolicy[] => {
    const rawTokens = query.toLowerCase().split(/[^a-z0-9]+/).filter(t => t.length > 2);
    const tokens = rawTokens.filter(t => !STOP_WORDS.has(t));
    if (tokens.length === 0) return [];

    const policyTerms = buildPolicyTerms();
    const nounTokens = tokens.filter(t => policyTerms.has(t));
    const bigrams = toBigrams(tokens);

    const isSocialSecurityQuery = tokens.includes("social") && tokens.includes("security");
    const isHealthcareQuery = tokens.some(t => ["healthcare", "medical", "medicare", "medicaid"].includes(t));
    const isEconomicQuery = tokens.some(t => ["economy", "economic", "jobs", "wages", "employment"].includes(t));
    const isEducationQuery = tokens.some(t => ["education", "school", "teacher", "college"].includes(t));
    const isClimateQuery = tokens.some(t => ["climate", "environment", "flood", "flooding", "storm", "heat", "energy", "renewable", "solar", "wind"].includes(t));
    const isLocalNJQuery = tokens.some(t => ["nj-12", "nj12", "trenton", "princeton", "brunswick", "bound", "brook", "manville", "plainfield", "somerville"].includes(t));
    const isCampaignFinanceQuery = tokens.some(t => ["campaign", "finance", "reform", "donor", "donation", "money", "corporate", "pac", "citizens", "united"].includes(t)) || 
                                  bigrams.some(b => ["campaign finance", "citizens united", "dark money", "corporate donations", "corporate money"].includes(b));
    const isAutomationQuery = tokens.some(t => ["ai", "artificial", "intelligence", "robotics", "automation", "dignity", "corporate", "taxes", "displacement"].includes(t)) ||
                             bigrams.some(b => ["human dignity", "corporate taxes", "worker displacement", "ai displacement", "automation jobs"].includes(b));

    return policies
      .map(p => {
        const fields = {
          title: p.title.toLowerCase(),
          description: p.description.toLowerCase(),
          example: (p.localizedExample || "").toLowerCase(),
          category: p.category.toLowerCase(),
        };

        if (isSocialSecurityQuery && p.category === "Foreign Policy") return null;
        if (isHealthcareQuery && !fields.title.includes("health") && !fields.description.includes("health") && !fields.category.includes("health")) {
          if (!tokens.some(t => fields.title.includes(t) || fields.description.includes(t))) return null;
        }
        if (isClimateQuery && p.category === "Foreign Policy") return null;
        if (isLocalNJQuery && p.category === "Foreign Policy" && !tokens.some(t => ["war", "foreign", "international"].includes(t))) return null;

        let score = 0;
        let matchedNoun = false;
        const phraseMatches: string[] = [];
        const matches: Record<string, Set<string>> = {
          title: new Set<string>(),
          description: new Set<string>(),
          example: new Set<string>(),
          category: new Set<string>(),
        };

        if (isAutomationQuery && fields.title.includes("human dignity")) {
          score += 10;
          matches.title.add("human dignity");
        }

        if (isCampaignFinanceQuery) {
          const isCampaignFinancePolicy = 
            fields.title.includes("zero") && fields.description.includes("donor") ||
            fields.title.includes("accountability") && fields.description.includes("corporate") ||
            fields.title.includes("citizens") && fields.title.includes("united") ||
            fields.description.includes("dark money") ||
            fields.description.includes("pac") ||
            fields.category.includes("democracy") && fields.category.includes("reform") ||
            fields.category.includes("accountability");
          
          if (isCampaignFinancePolicy) {
            score += 5;
            matches.category.add("campaign finance");
          }
        }

        for (const token of tokens) {
          const isNoun = nounTokens.includes(token);
          const titleHas = fields.title.includes(token);
          const descHas = fields.description.includes(token);
          const exHas = fields.example.includes(token);
          const catHas = fields.category.includes(token);

          if (titleHas) { score += 3 + (isNoun ? 2 : 0); matches.title.add(token); }
          if (descHas) { score += 2 + (isNoun ? 1 : 0); matches.description.add(token); }
          if (exHas)   { score += 1 + (isNoun ? 1 : 0); matches.example.add(token); }
          if (catHas)  { score += 1 + (isNoun ? 1 : 0); matches.category.add(token); }

          if (isNoun && (titleHas || descHas || catHas || exHas)) matchedNoun = true;
        }

        for (const phrase of bigrams) {
          if (fields.title.includes(phrase)) { score += 4; phraseMatches.push(phrase); }
          else if (fields.description.includes(phrase)) { score += 3; phraseMatches.push(phrase); }
          else if (fields.example.includes(phrase)) { score += 2; phraseMatches.push(phrase); }
          else if (fields.category.includes(phrase)) { score += 2; phraseMatches.push(phrase); }
        }
        if (phraseMatches.length > 0) matchedNoun = true;

        const parts: string[] = [];
        if (matches.title.size) parts.push(`title matched: ${Array.from(matches.title).join(", ")}`);
        if (matches.description.size) parts.push(`description matched: ${Array.from(matches.description).join(", ")}`);
        if (matches.example.size) parts.push(`example matched: ${Array.from(matches.example).join(", ")}`);
        if (matches.category.size) parts.push(`category matched: ${normalizeCategory(p.category).toLowerCase()}`);
        if (phraseMatches.length) parts.push(`phrase matched: ${phraseMatches.join(", ")}`);

        const reason = parts.length ? parts.join("; ") : "General relevance to your query";

        return { policy: p, score, reason, matchedNoun } as const;
      })
      .filter(r => r !== null && r.score > 0)
      .filter(r => {
        const nounCount = nounTokens.length;
        return nounCount === 0 ? true : (r as any).matchedNoun;
      })
      .slice(0, 6)
      .map(r => ({ policy: (r as any).policy, reason: (r as any).reason }));
  };

  const generateResponse = (userMessage: string, fromPolicyTile: boolean = false, policyTitle?: string) => {
    const msg = userMessage.toLowerCase();
    const relevantPolicies = findRelevantPolicies(userMessage, policyTitle);

    const isYesNoQuestion = /\b(does|do|is|are|will|would|can|could|should|has|have|had)\b.*\?/.test(msg) || 
                           /\b(support|oppose|favor|against|back|endorse)\b/.test(msg);

    const isHealthcareIntent = /(healthcare|health care|health|medical|medicare|medicaid)/.test(msg);
    const isEconomyIntent = /(economy|economic|jobs|wages|employment|work)/.test(msg);
    const isEnvironmentIntent = /(environment|climate|clean energy|pollution|flood|heat wave)/.test(msg);
    const isEducationIntent = /(education|school|teacher|college|tuition|student loan)/.test(msg);
    const isDemocracyIntent = /(democracy|voting|election|ranked-?choice|gerrymander|citizens united)/.test(msg);
    const isCampaignFinanceIntent = /(campaign.*(finance|reform|money)|finance.*(reform|campaign)|dark.?money|corporate.*(donation|money)|pac.*(donation|money)|zero.?donor)/.test(msg);
    const isHousingIntent = /(housing|rent|affordable|homebuyer|mortgage)/.test(msg);
    const isRetirementIntent = /(social security|retirement|seniors|pension)/.test(msg);
    const isForeignIntent = /(foreign|international|war|peace|middle east|palestine|israel|ukraine|russia)/.test(msg);
    const isAutomationIntent = /(ai|artificial.?intelligence|robotics|automation|dignity|corporate.?taxes|displacement|human.?dignity)/.test(msg);

    const buildSummary = (lead: string, items: RelatedPolicy[]) => {
      const top = items.slice(0, 4);
      const bullets = top
        .map((rp) => `- ${rp.policy.title}: ${rp.policy.description}`)
        .join("\n");
      const text = `${lead}\n\nHighlights:\n${bullets}`;
      return { text, policies: items };
    };

    if (isAutomationIntent) {
      let items = relevantPolicies.filter((rp) => {
        const cat = normalizeCategory(rp.policy.category).toLowerCase();
        return (
          cat.includes("economic") ||
          rp.policy.title.toLowerCase().includes("human dignity")
        );
      });

      if (items.length === 0) {
        items = policies
          .filter((p) => {
            const cat = normalizeCategory(p.category).toLowerCase();
            return (
              cat.includes("economic") ||
              p.title.toLowerCase().includes("human dignity")
            );
          })
          .map((p) => ({ policy: p, reason: "Automation and human dignity related" } as RelatedPolicy));
      }

      return buildSummary(
        "Winston's vision ensures human dignity in an AI-driven economy by taxing corporations to fund a Human Dignity Income, guaranteeing all Americans benefit from technological progress without punishing workers for automation-driven displacement.",
        items
      );
    }

    if (isYesNoQuestion) {
      const mentionsPrivatizeSS = /(privati[sz](e|ation|ing)).*(social.?security)|social.?security.*(privati[sz](e|ation|ing))/.test(msg);
      const mentionsPrivatizeMedicare = /(privati[sz](e|ation|ing)).*(medicare)|medicare.*(privati[sz](e|ation|ing))/.test(msg);
      const mentionsUniversalHealthcare = /universal.*(healthcare|health.?care)|single.?payer|medicare.?for.?all/.test(msg);
      const mentionsReproductiveHealth = /reproductive.*(health|rights)|abortion.*(access|rights)|protect.*(abortion|reproductive)/.test(msg);
      const mentionsExpandMedicare = /expand.*(medicare|medicaid)|strengthen.*(medicare|medicaid)/.test(msg);
      const mentionsRankedChoice = /ranked.?choice.*(voting|elections)|support.*ranked.?choice/.test(msg);
      const mentionsCitizensUnited = /citizens.?united|overturn.*citizens|dark.?money|corporate.*(money|donations)/.test(msg);
      const mentionsGerrymandering = /gerrymander|redistrict|end.*gerrymander/.test(msg);
      const mentionsElectoralCollege = /electoral.?college|abolish.*electoral|popular.?vote/.test(msg);
      const mentionsStatehood = /statehood.*(dc|puerto.?rico)|dc.*statehood|puerto.?rico.*statehood/.test(msg);
      const mentionsTermLimits = /term.?limits|limits.*congress|limits.*supreme.?court/.test(msg);
      const mentionsRaisingWages = /rais(e|ing).*(wage|pay)|increase.*(wage|pay)|fair.?pay/.test(msg);
      const mentionsUnions = /union|labor.*(rights|protect)|protect.*union/.test(msg);
      const mentionsTaxLoopholes = /tax.?loopholes|corporate.?tax|close.*loopholes/.test(msg);
      const mentionsCorporateDonations = /corporate.*(donation|money)|pac.*(donation|money)|accept.*(corporate|pac)/.test(msg);
      const mentionsCleanEnergy = /clean.?energy|renewable.*(energy|power)|solar|wind.*(energy|power)/.test(msg);
      const mentionsGreenNewDeal = /green.?new.?deal|climate.*(action|policy)/.test(msg);
      const mentionsTeacherPay = /teacher.*(pay|wage)|increase.*teacher|rais.*teacher/.test(msg);
      const mentionsPublicSchools = /public.?school.*(fund|support)|protect.*public.?school/.test(msg);
      const mentionsLGBTQ = /lgbtq|lgbt|gay|lesbian|transgender|trans|queer|sexual.*(orientation|identity)|gender.*(identity|equality)|marriage.*(equality|equal)|same.?sex/.test(msg);
      const mentionsAutomationSupport = /(support|favor|back|endorse).*(ai|robotics|automation|human.?dignity|corporate.?taxes)/.test(msg);

      if (mentionsAutomationSupport) {
        const automationPolicies = policies
          .filter(p => p.category.toLowerCase().includes("economic") || p.title.toLowerCase().includes("human dignity"))
          .map(p => ({ policy: p, reason: "Automation and human dignity related" } as RelatedPolicy));
        return buildSummary(
          "Yes. Winston supports policies to address AI and robotics-driven displacement, including a Human Dignity Income funded by higher corporate taxes to ensure shared prosperity.",
          automationPolicies
        );
      }

      if (mentionsPrivatizeSS) {
        const ssRelevantPolicies = relevantPolicies.length ? relevantPolicies : 
          policies.filter(p => p.title.toLowerCase().includes("social security"))
                  .map(p => ({ policy: p, reason: "Social Security related" } as RelatedPolicy));
        return buildSummary(
          "No. Winston does not support privatizing Social Security—he supports strengthening Social Security with doubled payments for livable retirements.",
          ssRelevantPolicies
        );
      }

      if (mentionsPrivatizeMedicare) {
        const healthPolicies = policies.filter(p => p.category.toLowerCase().includes("health"))
                                     .map(p => ({ policy: p, reason: "Healthcare related" } as RelatedPolicy));
        return buildSummary(
          "No. Winston does not support privatizing Medicare—he supports strengthening Medicare and moving toward single-payer (Medicare-for-All).",
          healthPolicies
        );
      }

      if (mentionsUniversalHealthcare) {
        const healthPolicies = policies.filter(p => p.category.toLowerCase().includes("health"))
                                     .map(p => ({ policy: p, reason: "Healthcare related" } as RelatedPolicy));
        return buildSummary(
          "Yes. Winston supports universal healthcare through single-payer (Medicare-for-All).",
          healthPolicies
        );
      }

      if (mentionsReproductiveHealth) {
        const healthPolicies = policies.filter(p => p.category.toLowerCase().includes("health"))
                                     .map(p => ({ policy: p, reason: "Healthcare related" } as RelatedPolicy));
        return buildSummary(
          "Yes. Winston supports protecting reproductive health and guaranteeing abortion access.",
          healthPolicies
        );
      }

      if (mentionsExpandMedicare) {
        const healthPolicies = policies.filter(p => p.category.toLowerCase().includes("health"))
                                     .map(p => ({ policy: p, reason: "Healthcare related" } as RelatedPolicy));
        return buildSummary(
          "Yes. Winston supports expanding and strengthening Medicare and Medicaid.",
          healthPolicies
        );
      }

      if (mentionsRankedChoice) {
        const democracyPolicies = policies.filter(p => p.category.toLowerCase().includes("democracy"))
                                        .map(p => ({ policy: p, reason: "Democracy related" } as RelatedPolicy));
        return buildSummary(
          "Yes. Winston supports ranked-choice voting for fairer elections.",
          democracyPolicies
        );
      }

      if (mentionsCitizensUnited) {
        const democracyPolicies = policies.filter(p => p.category.toLowerCase().includes("democracy"))
                                        .map(p => ({ policy: p, reason: "Democracy related" } as RelatedPolicy));
        const asksAboutOverturning = /overturn|ban|end|against|oppose/.test(msg);
        const asksAboutSupporting = /support.*citizens.?united/.test(msg) && !asksAboutOverturning;
        
        if (asksAboutSupporting) {
          return buildSummary(
            "No. Winston does not support Citizens United—he supports overturning it and banning dark money.",
            democracyPolicies
          );
        } else {
          return buildSummary(
            "Yes. Winston supports overturning Citizens United and banning dark money.",
            democracyPolicies
          );
        }
      }

      if (mentionsGerrymandering) {
        const democracyPolicies = policies.filter(p => p.category.toLowerCase().includes("democracy"))
                                        .map(p => ({ policy: p, reason: "Democracy related" } as RelatedPolicy));
        return buildSummary(
          "Yes. Winston supports ending gerrymandering through independent redistricting.",
          democracyPolicies
        );
      }

      if (mentionsElectoralCollege) {
        const democracyPolicies = policies.filter(p => p.category.toLowerCase().includes("democracy"))
                                        .map(p => ({ policy: p, reason: "Democracy related" } as RelatedPolicy));
        return buildSummary(
          "Yes. Winston supports abolishing/neutralizing the Electoral College through the National Popular Vote Interstate Compact.",
          democracyPolicies
        );
      }

      if (mentionsStatehood) {
        const democracyPolicies = policies.filter(p => p.category.toLowerCase().includes("democracy"))
                                        .map(p => ({ policy: p, reason: "Democracy related" } as RelatedPolicy));
        return buildSummary(
          "Yes. Winston supports statehood for DC and Puerto Rico for equal representation.",
          democracyPolicies
        );
      }

      if (mentionsTermLimits) {
        const democracyPolicies = policies.filter(p => p.category.toLowerCase().includes("democracy"))
                                        .map(p => ({ policy: p, reason: "Democracy related" } as RelatedPolicy));
        return buildSummary(
          "Yes. Winston supports 18-year term limits for Congress and the Supreme Court.",
          democracyPolicies
        );
      }

      if (mentionsRaisingWages) {
        const economicPolicies = policies.filter(p => p.category.toLowerCase().includes("economic"))
                                       .map(p => ({ policy: p, reason: "Economic related" } as RelatedPolicy));
        return buildSummary(
          "Yes. Winston supports raising wages and enforcing fair pay to protect NJ-12 workers.",
          economicPolicies
        );
      }

      if (mentionsUnions) {
        const economicPolicies = policies.filter(p => p.category.toLowerCase().includes("economic"))
                                       .map(p => ({ policy: p, reason: "Economic related" } as RelatedPolicy));
        return buildSummary(
          "Yes. Winston supports protecting unions and labor rights to strengthen the NJ-12 workforce.",
          economicPolicies
        );
      }

      if (mentionsTaxLoopholes) {
        const economicPolicies = policies.filter(p => p.category.toLowerCase().includes("economic"))
                                       .map(p => ({ policy: p, reason: "Economic related" } as RelatedPolicy));
        return buildSummary(
          "Yes. Winston supports closing corporate tax loopholes and tying incentives to NJ job creation.",
          economicPolicies
        );
      }

      if (mentionsCorporateDonations) {
        const accountabilityPolicies = policies.filter(p => p.category.toLowerCase().includes("accountability"))
                                             .map(p => ({ policy: p, reason: "Accountability related" } as RelatedPolicy));
        return buildSummary(
          "No. Winston does not accept PAC or corporate donations—he runs a zero-donor, people-powered campaign.",
          accountabilityPolicies
        );
      }

      const mentionsCampaignFinanceReform = /campaign.*(finance|reform|money)|finance.*(reform|campaign)|reform.*(campaign|finance)/.test(msg);
      if (mentionsCampaignFinanceReform) {
        const campaignFinancePolicies = [
          ...policies.filter(p => p.category.toLowerCase().includes("accountability")),
          ...policies.filter(p => p.category.toLowerCase().includes("democracy") && p.category.toLowerCase().includes("reform"))
        ].map(p => ({ policy: p, reason: "Campaign finance reform related" } as RelatedPolicy));
        
        return buildSummary(
          "Yes. Winston strongly supports campaign finance reform—he runs a zero-donor campaign, supports overturning Citizens United, and backs stricter limits on corporate contributions.",
          campaignFinancePolicies
        );
      }

      if (mentionsCleanEnergy) {
        const environmentPolicies = policies.filter(p => p.category.toLowerCase().includes("environment") || p.category.toLowerCase().includes("sustainable"))
                                          .map(p => ({ policy: p, reason: "Environmental related" } as RelatedPolicy));
        return buildSummary(
          "Yes. Winston supports expanding clean energy including solar, wind, and renewable energy in New Jersey.",
          environmentPolicies
        );
      }

      if (mentionsGreenNewDeal) {
        const environmentPolicies = policies.filter(p => p.category.toLowerCase().includes("environment") || p.category.toLowerCase().includes("sustainable"))
                                          .map(p => ({ policy: p, reason: "Environmental related" } as RelatedPolicy));
        return buildSummary(
          "Yes. Winston supports comprehensive climate action including clean energy job pipelines and sustainable infrastructure.",
          environmentPolicies
        );
      }

      if (mentionsTeacherPay) {
        const educationPolicies = policies.filter(p => p.category.toLowerCase().includes("education"))
                                        .map(p => ({ policy: p, reason: "Education related" } as RelatedPolicy));
        return buildSummary(
          "Yes. Winston supports increasing teacher pay and enforcing pay equity in NJ schools.",
          educationPolicies
        );
      }

      if (mentionsPublicSchools) {
        const educationPolicies = policies.filter(p => p.category.toLowerCase().includes("education"))
                                        .map(p => ({ policy: p, reason: "Education related" } as RelatedPolicy));
        return buildSummary(
          "Yes. Winston supports protecting K-12 public school funding and stopping cuts in NJ-12 districts.",
          educationPolicies
        );
      }

      if (mentionsLGBTQ) {
        const socialPolicies = policies.filter(p => 
          p.category.toLowerCase().includes("health") || 
          p.category.toLowerCase().includes("democracy") ||
          p.title.toLowerCase().includes("equality") ||
          p.description.toLowerCase().includes("equality")
        ).map(p => ({ policy: p, reason: "Social equality related" } as RelatedPolicy));
        
        return buildSummary(
          "Yes. Winston supports LGBTQ+ equality including marriage equality, anti-discrimination protections, and comprehensive healthcare access for all.",
          socialPolicies
        );
      }
    }

    if (isHealthcareIntent || inferTopCategory(relevantPolicies)?.toLowerCase().includes("health")) {
      let healthPolicies: RelatedPolicy[] = (relevantPolicies.length ? relevantPolicies : policies.map(p => ({ policy: p, reason: "" } as RelatedPolicy)))
        .filter(rp => rp.policy.category.toLowerCase().includes("health"));

      if (healthPolicies.length === 0) {
        healthPolicies = policies
          .filter(p => p.category.toLowerCase().includes("health"))
          .map(p => ({ policy: p, reason: "Healthcare intent" } as RelatedPolicy));
      }

      if (healthPolicies.length > 0) {
        let response = "";
        if (isYesNoQuestion) {
          const mentionsSinglePayer = /single.?payer|medicare.?for.?all/.test(msg);
          const mentionsPrivatizeMedicare = /(privati[sz](e|ation|ing)).*(medicare)|medicare.*(privati[sz](e|ation|ing))/.test(msg);
          const mentionsPrivatizeSS = /(privati[sz](e|ation|ing)).*(social.?security)|social.?security.*(privati[sz](e|ation|ing))/.test(msg);
          const asksOpposePriv = /oppose.*(privati[sz].*(medicare|social.?security))|((privati[sz].*(medicare|social.?security)).*(oppose))/.test(msg);

          if ((mentionsPrivatizeMedicare || mentionsPrivatizeSS) && asksOpposePriv) {
            response = mentionsPrivatizeSS ? "Yes. Winston opposes privatizing Social Security and supports strengthening it." : "Yes. Winston opposes privatizing Medicare and supports strengthening Medicare, moving toward single-payer (Medicare-for-All).";
          } else if (mentionsPrivatizeSS) {
            response = "No. Winston does not support privatizing Social Security—he supports strengthening Social Security with doubled payments for livable retirements.";
          } else if (mentionsPrivatizeMedicare) {
            response = "No. Winston does not support privatizing Medicare—he supports strengthening Medicare and moving toward single-payer (Medicare-for-All).";
          } else if (mentionsSinglePayer) {
            response = "Yes. Winston supports single-payer (Medicare-for-All).";
          } else {
            response = "Yes. Winston supports comprehensive healthcare reform centered on single-payer (Medicare-for-All).";
          }
        } else {
          response = "Winston supports single-payer (Medicare-for-All): universal coverage with no premiums or copays at point of care, free provider choice, and negotiated drug/provider prices to lower costs for NJ-12.";
        }
        return buildSummary(response, healthPolicies);
      }
    }

    if (isEconomyIntent) {
      let items = relevantPolicies.filter((rp) => {
        const cat = normalizeCategory(rp.policy.category).toLowerCase();
        return (
          cat.includes("economic") ||
          cat.includes("jobs") ||
          cat.includes("cost of living") ||
          cat.includes("housing & family support")
        );
      });

      if (items.length === 0) {
        items = policies
          .filter((p) => {
            const cat = normalizeCategory(p.category).toLowerCase();
            return (
              cat.includes("economic") ||
              cat.includes("jobs") ||
              cat.includes("cost of living") ||
              cat.includes("housing & family support")
            );
          })
          .map((p) => ({ policy: p, reason: "Economy related" } as RelatedPolicy));
      }

      return buildSummary(
        "Winston's economic plan grows good-paying jobs, supports small businesses, raises family incomes, and includes a Human Dignity Income to support workers displaced by AI and automation.",
        items
      );
    }

    if (isEnvironmentIntent) {
      return buildSummary(
        "Winston's climate plan invests in clean energy, protects waterways, and builds flood/heat resilience across NJ-12.",
        relevantPolicies
      );
    }

    if (isEducationIntent) {
      return buildSummary(
        "Winston's education agenda raises teacher pay, protects K-12 funding, expands Pre-K/childcare, and makes college more affordable.",
        relevantPolicies
      );
    }

    if (isDemocracyIntent) {
      return buildSummary(
        "Winston strengthens democracy with verified digital townhalls, voting rights protections, ranked-choice voting, and an end to gerrymandering.",
        relevantPolicies
      );
    }

    if (isCampaignFinanceIntent) {
      const campaignFinancePolicies = [
        ...policies.filter(p => p.category.toLowerCase().includes("accountability")),
        ...policies.filter(p => p.category.toLowerCase().includes("democracy") && p.category.toLowerCase().includes("reform"))
      ].map(p => ({ policy: p, reason: "Campaign finance reform related" } as RelatedPolicy));
      return buildSummary(
        "Winston strongly supports campaign finance reform—zero-donor campaign, overturn Citizens United, and stricter limits on corporate contributions.",
        campaignFinancePolicies
      );
    }

    if (isHousingIntent) {
      return buildSummary(
        "Winston expands affordable housing, protects renters, supports first-time homebuyers, and advances paid family leave.",
        relevantPolicies
      );
    }

    if (isRetirementIntent) {
      return buildSummary(
        "Winston protects retirement security by strengthening Social Security and guaranteeing dignified, livable benefits through doubled payments for seniors.",
        relevantPolicies
      );
    }

    if (isForeignIntent) {
      return buildSummary(
        "Winston advances diplomacy-first foreign policy, ends endless wars, supports a two-state solution, and defends Ukraine's territorial integrity.",
        relevantPolicies
      );
    }

    if (relevantPolicies.length > 0) {
      const topCat = inferTopCategory(relevantPolicies);
      const lead = topCat
        ? `Here's a concise summary of Winston's policies on ${topCat.toLowerCase()}.`
        : "Here's how Winston approaches this topic.";

      let items = relevantPolicies;
      if (topCat) {
        items = relevantPolicies.filter((rp) => normalizeCategory(rp.policy.category) === topCat);
        if (items.length === 0) {
          items = policies
            .filter((p) => normalizeCategory(p.category) === topCat)
            .map((p) => ({ policy: p, reason: `${topCat} related` } as RelatedPolicy));
        }
      }
      return buildSummary(lead, items);
    }

    return {
      text:
        "I couldn't find a direct match. Try asking about specific areas like health care, economy, environment, education, democracy, housing, Social Security, or AI-driven worker displacement.",
      policies: []
    };
  };

  const inferTopCategory = (rps: RelatedPolicy[]) => {
    const counts: Record<string, number> = {};
    for (const rp of rps) {
      const cat = normalizeCategory(rp.policy.category);
      counts[cat] = (counts[cat] || 0) + 1;
    }
    let top: string | null = null;
    let max = 0;
    for (const [cat, n] of Object.entries(counts)) {
      if (n > max) { top = cat; max = n; }
    }
    return top;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isBot: false,
      timestamp: new Date(),
      fromPolicyTile: false,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      let aiPolicies: RelatedPolicy[] = [];
      try {
        const policyContext = policies.map(p => ({
          id: p.id,
          title: p.title,
          category: p.category,
          description: p.description,
          localizedExample: p.localizedExample,
        }));
        const aiRes = await supabase.functions.invoke('policy-matcher', {
          body: {
            query: userMessage.text,
            policies: policyContext,
            maxResults: 6,
          }
        });

        if (aiRes.data?.relevantPolicies?.length) {
          aiPolicies = (aiRes.data.relevantPolicies as any[])
            .map((r) => {
              const pol = policies.find(p => p.id === r.policyId);
              return pol ? ({ policy: pol, reason: r.reason || 'Semantically relevant' } as RelatedPolicy) : null;
            })
            .filter(Boolean) as RelatedPolicy[];
        }
      } catch (e) {
        console.warn('[PolicyChat] policy-matcher failed, using fallback matcher:', e);
      }

      if (aiPolicies.length > 0) {
        const bullets = aiPolicies.slice(0, 4).map(rp => `- ${rp.policy.title}: ${rp.policy.description}`).join("\n");
        const policySummary = `Top policy matches for your question:\n\n${bullets}`;

        const ai = await generateAIResponse(userMessage.text, policySummary, aiPolicies);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: ai.text,
          isBot: true,
          timestamp: new Date(),
          relatedPolicies: aiPolicies,
          moderationFlagged: ai.moderationFlagged,
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const response = generateResponse(userMessage.text, false);
        const ai = await generateAIResponse(userMessage.text, response.text, response.policies);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: ai.text,
          isBot: true,
          timestamp: new Date(),
          relatedPolicies: response.policies,
          moderationFlagged: ai.moderationFlagged,
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      const response = generateResponse(userMessage.text, false);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isBot: true,
        timestamp: new Date(),
        relatedPolicies: response.policies,
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePolicyMoreClick = (policyTitle: string) => {
    const userQuestion = `Tell me about Winston's "${policyTitle}" policy`;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userQuestion,
      isBot: false,
      timestamp: new Date(),
      fromPolicyTile: true,
      policyTitle,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    (async () => {
      try {
        const relevantPolicies = findRelevantPolicies(userQuestion, policyTitle);
        const policySummary = relevantPolicies.length > 0
          ? `Top policy matches for your question:\n\n${relevantPolicies.slice(0, 4).map(rp => `- ${rp.policy.title}: ${rp.policy.description}`).join("\n")}`
          : `Details for "${policyTitle}" policy`;

        const ai = await generateAIResponse(userQuestion, policySummary, relevantPolicies, policyTitle);
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: ai.text,
          isBot: true,
          timestamp: new Date(),
          relatedPolicies: relevantPolicies,
          moderationFlagged: ai.moderationFlagged,
        };

        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('Error generating AI response:', error);
        const response = generateResponse(userQuestion, true, policyTitle);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          isBot: true,
          timestamp: new Date(),
          relatedPolicies: response.policies,
        };
        setMessages(prev => [...prev, botMessage]);
      } finally {
        setIsTyping(false);
      }
    })();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Winston For Congress Policy Chat Assistant
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/20 rounded-md">
            {messages.map((message, index) => (
              <div 
                key={message.id} 
                className="space-y-4"
                ref={message.isBot && index === messages.length - 1 ? lastBotMessageRef : null}
              >
                <div className={`flex gap-3 ${message.isBot ? "" : "flex-row-reverse"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isBot ? "bg-primary text-primary-foreground" : "bg-secondary"
                  }`}>
                    {message.isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className={`flex-1 space-y-2 ${message.isBot ? "" : "flex flex-col items-end"}`}>
                    <div className={`rounded-lg p-3 max-w-[80%] ${
                      message.isBot 
                        ? "bg-background border" 
                        : "bg-primary text-primary-foreground"
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </div>
                    
                    {message.isBot && message.id !== "welcome" && !message.moderationFlagged && messages.some(m => !m.isBot) && (
                      <div className="p-4 border rounded-lg bg-card space-y-4 max-w-[80%]">
                        <h4 className="font-medium text-sm">Feedback</h4>
                        
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground">
                            How well did this response address your question? (0-5)
                          </label>
                          <div className="flex gap-2">
                            {[0, 1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                onClick={() => updateMessageFeedback(message.id, { topicRating: rating })}
                                className={`w-8 h-8 rounded-full text-xs border transition-colors ${
                                  message.feedback?.topicRating === rating
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background hover:bg-accent border-border'
                                }`}
                              >
                                {rating}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground">
                            Do you agree with Winston's policies mentioned?
                          </label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateMessageFeedback(message.id, { agreesWithPolicies: true })}
                              className={`px-3 py-1 rounded text-xs border transition-colors ${
                                message.feedback?.agreesWithPolicies === true
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-background hover:bg-accent border-border'
                              }`}
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => updateMessageFeedback(message.id, { agreesWithPolicies: false })}
                              className={`px-3 py-1 rounded text-xs border transition-colors ${
                                message.feedback?.agreesWithPolicies === false
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-background hover:bg-accent border-border'
                              }`}
                            >
                              No
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground">
                            Additional comments (optional)
                          </label>
                          <textarea
                            value={message.feedback?.comment || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= MAX_FEEDBACK_COMMENT_LENGTH) {
                                updateMessageFeedback(message.id, { comment: value });
                              }
                            }}
                            placeholder="Share your thoughts..."
                            className="w-full p-2 text-xs border rounded resize-none bg-background"
                            rows={2}
                            maxLength={MAX_FEEDBACK_COMMENT_LENGTH}
                          />
                          <div className="flex justify-end">
                            <span className={`text-xs ${(message.feedback?.comment?.length || 0) > MAX_FEEDBACK_COMMENT_LENGTH * 0.9 ? "text-warning" : "text-muted-foreground"}`}>
                              {message.feedback?.comment?.length || 0}/{MAX_FEEDBACK_COMMENT_LENGTH}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2">
                          <Button
                            size="sm"
                            disabled={
                              !message.feedback?.topicRating && 
                              message.feedback?.agreesWithPolicies === undefined && 
                              !message.feedback?.comment?.trim()
                            }
                            onClick={() => {
                              const feedback = message.feedback;
                              const subject = encodeURIComponent('Policy Chat Feedback');
                              const body = encodeURIComponent(
                                `Feedback for Policy Chat Response\n\n` +
                                `User Question: ${messages.find(m => m.timestamp < message.timestamp && !m.isBot)?.text || 'N/A'}\n\n` +
                                `Campaign Response: ${message.text}\n\n` +
                                `Response Quality Rating: ${feedback?.topicRating ?? 'Not rated'}/5\n\n` +
                                `Agrees with Policies: ${feedback?.agreesWithPolicies === true ? 'Yes' : feedback?.agreesWithPolicies === false ? 'No' : 'Not answered'}\n\n` +
                                `Additional Comments: ${feedback?.comment || 'None'}\n\n` +
                                `Timestamp: ${message.timestamp.toLocaleString()}`
                              );
                              window.open(`mailto:campaign@winstonforcongress.com?subject=${subject}&body=${body}`);
                            }}
                            className="text-xs"
                          >
                            Submit Feedback
                          </Button>
                        </div>
                      </div>
                    )}

                    {message.relatedPolicies && message.relatedPolicies.length > 0 && !message.moderationFlagged && (
                      <div className="space-y-2 max-w-[80%]">
                        <p className="text-xs text-muted-foreground">Related policies:</p>
                        {message.relatedPolicies.map((rp, index) => (
                          <div key={index} className="bg-background border rounded-md p-2">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h4 className="font-medium text-xs">{rp.policy.title}</h4>
                              <div className="flex items-center gap-1">
                                <Badge variant="secondary" className="text-xs">{rp.policy.id}</Badge>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handlePolicyMoreClick(rp.policy.title)}
                                  className="h-5 w-5 p-0 hover:bg-accent"
                                >
                                  <ChevronRight className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">{normalizeCategory(rp.policy.category)}</p>
                            <p className="text-xs mt-1">{rp.policy.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">Why related: {rp.reason}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-background border rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about any policy area..."
                value={input}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= MAX_CHAT_INPUT_LENGTH) {
                    setInput(value);
                  }
                }}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
                className="flex-1"
                maxLength={MAX_CHAT_INPUT_LENGTH}
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isTyping || input.length > MAX_CHAT_INPUT_LENGTH}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span></span>
              <span className={input.length > MAX_CHAT_INPUT_LENGTH * 0.9 ? "text-warning" : ""}>
                {input.length}/{MAX_CHAT_INPUT_LENGTH}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}