import { useState, useRef, useEffect } from "react";
import { tools, toolCategories } from "@/data/tools";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, ChevronRight, Shield, Zap, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";


type Tool = typeof tools[number];

interface HackerGPTChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RelatedTool {
  tool: Tool;
  reason: string;
}

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  relatedTools?: RelatedTool[];
  moderationFlagged?: boolean;
  feedback?: {
    topicRating?: number;
    findsUseful?: boolean;
    comment?: string;
  };
  fromToolTile?: boolean;
  toolTitle?: string;
}

export function HackerGPTChat({ open, onOpenChange }: HackerGPTChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "🛡️ **Welcome to HackerGPT!** I'm your AI-powered cybersecurity assistant.\n\nI can help you understand our cutting-edge OSINT and penetration testing tools:\n\n• **Network Scanning** - TCP/UDP/SYN scans, service detection\n• **Dark Web Intelligence** - Monitor .onion sites and data breaches\n• **Crypto Analysis** - Blockchain forensics and sanctions screening\n• **Premium OSINT** - Advanced reconnaissance and intelligence gathering\n\n**Ready to upgrade your security capabilities?** Ask me about any tool or start your free trial today!",
      isBot: true,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingIndicatorRef = useRef<HTMLDivElement>(null);

  const MAX_CHAT_INPUT_LENGTH = 300;
  const MAX_FEEDBACK_COMMENT_LENGTH = 300;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Begin full HackerGPTChat implementation ---
  // All state, refs, and handlers from the provided HackerGPTChat code:
  const lastBotMessageRef = useRef<HTMLDivElement>(null);

  // Handler for sending a message
  const formatAIResponse = (rawText: string): string => {
    const paragraphs = rawText.split('\n\n').map(p => p.trim()).filter(p => p);
    const formattedParagraphs = paragraphs.map(paragraph => {
      const lines = paragraph.split('\n').map(line => line.trim());
      const isList = lines.every(line => line.match(/^[-*]|^[0-9]+\./));
      if (isList) {
        return lines.map(line => line.startsWith('*') || line.startsWith('-') ? `- ${line.slice(1).trim()}` : line).join('\n');
      }
      return paragraph.replace(/\n/g, ' ').trim();
    });
    return formattedParagraphs.join('\n\n');
  };

  const generateAIResponse = async (userMessage: string, toolSummary: string, relatedTools: RelatedTool[], toolTitle?: string): Promise<{ text: string; moderationFlagged?: boolean }> => {
    const systemPrompt = `You are HackerGPT's AI sales assistant, designed to convert prospects into paying subscribers.

HACKERGPT PLATFORM OVERVIEW:
HackerGPT is the world's most advanced AI-powered cybersecurity platform offering:
- Autonomous OSINT and discovery tools
- Advanced penetration testing capabilities  
- Dark web intelligence monitoring
- Cryptocurrency forensics and analysis
- Premium reconnaissance features

TOOL CATEGORIES:
${toolCategories.map(cat => `• ${cat}`).join('\n')}

${toolTitle ? `SPECIFIC TOOL QUERY: The user is asking about "${toolTitle}". Provide detailed information about this tool's capabilities, use cases, and value proposition.` : `CURRENT QUERY CONTEXT: ${toolSummary}`}

AVAILABLE TOOLS: ${relatedTools.map(rt => `${rt.tool.title}: ${rt.tool.description} ${rt.tool.isPremium ? '(PREMIUM)' : '(FREE)'}`).join('\n')}

CRITICAL PRESALES RULES:
1. STAY ON TOPIC: If asked about unrelated topics (circus, weather, general questions), immediately redirect to HackerGPT capabilities
2. DEFEND VALUE: Never list product weaknesses or concerns. Always position HackerGPT positively
3. KEEP RESPONSES CONCISE: Maximum 3-4 paragraphs, always end with strong call-to-action
4. REDIRECT OFF-TOPIC: "I'm here to help you discover HackerGPT's cybersecurity capabilities. Let me show you..."

SALES-FOCUSED RESPONSE GUIDELINES:
- Emphasize HackerGPT's competitive advantages and unique AI capabilities
- Highlight time savings and efficiency gains compared to manual methods
- Mention specific use cases: penetration testing, OSINT investigations, compliance audits
- For premium tools, emphasize advanced features and professional-grade capabilities
- Include conversion prompts: "upgrade to premium", "start your free trial", "unlock advanced features"
- Address security concerns: ethical use, legal compliance, responsible disclosure
- Position HackerGPT as essential for cybersecurity professionals, researchers, and organizations
- Use technical credibility while remaining accessible to different skill levels
- Always end with a call-to-action related to trying or subscribing to HackerGPT

CONVERSION TRIGGERS:
- "Ready to experience the power of AI-driven cybersecurity?"
- "Upgrade to HackerGPT Premium for advanced capabilities"
- "Start your free trial and see the difference"
- "Join thousands of security professionals using HackerGPT"`;

    try {
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

      const rawContent = response.data?.choices?.[0]?.message?.content ?? 'I apologize, but I could not process your request at this time.';
      const formattedContent = formatAIResponse(rawContent);
      return { text: formattedContent, moderationFlagged: false };
    } catch (error) {
      console.error('Error generating AI response:', error);
      return { text: "I'm having trouble connecting to the server. Please try again later." };
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Scroll to show typing indicator
    setTimeout(() => {
      if (typingIndicatorRef.current) {
        typingIndicatorRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);

    try {
      const relevantTools = tools.filter(tool => 
        tool.title.toLowerCase().includes(input.toLowerCase()) ||
        tool.description.toLowerCase().includes(input.toLowerCase()) ||
        tool.category.toLowerCase().includes(input.toLowerCase())
      ).slice(0, 4);

      const toolSummary = relevantTools.length > 0 
        ? `Found ${relevantTools.length} relevant tools: ${relevantTools.map(t => t.title).join(', ')}`
        : 'General HackerGPT capabilities inquiry';

      const ai = await generateAIResponse(userMessage.text, toolSummary, relevantTools.map(tool => ({
        tool,
        reason: "Related to your query"
      })));

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: ai.text,
        isBot: true,
        timestamp: new Date(),
        relatedTools: relevantTools.map(tool => ({
          tool,
          reason: "Related to your query"
        })),
        moderationFlagged: ai.moderationFlagged,
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Smooth scroll to the bot response after a brief delay
      setTimeout(() => {
        if (lastBotMessageRef.current) {
          lastBotMessageRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    } catch (error) {
      console.error('Error handling message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I encountered an error processing your request. Please try again.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Smooth scroll to error message too
      setTimeout(() => {
        if (lastBotMessageRef.current) {
          lastBotMessageRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    } finally {
      setIsTyping(false);
    }
  };
  // --- End full HackerGPTChat implementation ---

  // The actual return statement from the provided code:
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            HackerGPT Capabilities Chat Assistant
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
                    {/* ...feedback and related tools UI as in the reference... */}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3" ref={typingIndicatorRef}>
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
                placeholder="Ask about any feature..."
                value={input}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= MAX_CHAT_INPUT_LENGTH) {
                    setInput(value);
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
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
