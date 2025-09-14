import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, CheckCircle } from "lucide-react";

interface ScopingChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  options?: string[];
  allowMultiple?: boolean;
  isInput?: boolean;
}

interface ScopingData {
  companyName: string;
  industry: string;
  companySize: string;
  infrastructureType: string;
  applications: string;
  complianceNeeds: string;
  cybersecurityServices: string[];
  specificNeeds: string;
  contactEmail: string;
}

const QUESTIONS = [
  {
    id: 'welcome',
    text: "Welcome to White Hack Labs! We're here to help protect your digital assets. To get started, please answer a few questions about your cybersecurity needs so we can provide a tailored quote for our services.",
    followUp: "Let's begin with some basic information about your company."
  },
  {
    id: 'companyName',
    text: "What is the name of your company?",
    followUp: "Thank you! Let's move on to understand your business better.",
    field: 'companyName' as keyof ScopingData,
    isInput: true
  },
  {
    id: 'industry',
    text: "What industry does your company operate in?",
    options: ['Enterprise', 'Healthcare', 'Financial Services', 'Information Technology', 'Other (please specify)'],
    followUp: "Got it! This helps us understand your specific security requirements.",
    field: 'industry' as keyof ScopingData
  },
  {
    id: 'companySize',
    text: "How many employees does your company have?",
    options: ['1-50', '51-200', '201-500', '501-1000', '1000+'],
    followUp: "Thanks for sharing! This gives us an idea of the scale of your operations.",
    field: 'companySize' as keyof ScopingData
  },
  {
    id: 'infrastructureType',
    text: "What type of infrastructure does your company primarily use?",
    options: ['Corporate (On-premises)', 'Cloud (AWS, Google Cloud, etc.)', 'Blockchain', 'Hybrid', 'Other (please specify)'],
    followUp: "Great, this helps us tailor our approach to your infrastructure.",
    field: 'infrastructureType' as keyof ScopingData
  },
  {
    id: 'applications',
    text: "Do you operate SaaS, mobile, or web applications that require security testing?",
    options: ['SaaS', 'Mobile', 'Web', 'Multiple', 'None'],
    followUp: "Understood! This tells us about your application security needs.",
    field: 'applications' as keyof ScopingData
  },
  {
    id: 'complianceNeeds',
    text: "Are you seeking compliance with any specific standards?",
    options: ['SOC2', 'PCI-DSS', 'HIPAA', 'GLBA', 'None', 'Other (please specify)'],
    followUp: "Thanks for clarifying your compliance requirements.",
    field: 'complianceNeeds' as keyof ScopingData
  },
  {
    id: 'cybersecurityServices',
    text: "Which cybersecurity services are you interested in? (Select all that apply)",
    options: [
      'Penetration Testing',
      'Network Penetration Testing', 
      'Application Penetration Testing',
      'Red Teaming',
      'Cloud Security',
      'Blockchain Security',
      'SOC2 Compliance Testing',
      'Managed Security Services',
      'Other (please specify)'
    ],
    allowMultiple: true,
    followUp: "Excellent, we have a wide range of services to meet your needs.",
    field: 'cybersecurityServices' as keyof ScopingData
  },
  {
    id: 'specificNeeds',
    text: "Please provide a brief description of your cybersecurity needs or any specific concerns.",
    followUp: "Thank you for the details! This will help us customize our recommendations.",
    field: 'specificNeeds' as keyof ScopingData,
    isInput: true
  },
  {
    id: 'contactEmail',
    text: "What is your preferred contact email for receiving a quote?",
    followUp: "Perfect, we have all the information we need!",
    field: 'contactEmail' as keyof ScopingData,
    isInput: true
  }
];

export function ScopingChat({ open, onOpenChange }: ScopingChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scopingData, setScopingData] = useState<ScopingData>({
    companyName: '',
    industry: '',
    companySize: '',
    infrastructureType: '',
    applications: '',
    complianceNeeds: '',
    cybersecurityServices: [],
    specificNeeds: '',
    contactEmail: ''
  });
  const [input, setInput] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      // Initialize with welcome message
      const welcomeMessage: Message = {
        id: 'welcome-1',
        text: QUESTIONS[0].text,
        isBot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      
      // Add follow-up message after a brief delay
      setTimeout(() => {
        const followUpMessage: Message = {
          id: 'welcome-2',
          text: QUESTIONS[0].followUp!,
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, followUpMessage]);
        
        // Start with first actual question (company name)
        setTimeout(() => {
          askNextQuestion(1);
        }, 1000);
      }, 1500);
    }
  }, [open]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const askNextQuestion = (questionIndex: number) => {
    if (questionIndex >= QUESTIONS.length) {
      showCompletionMessage();
      return;
    }

    const question = QUESTIONS[questionIndex];
    const questionMessage: Message = {
      id: `question-${questionIndex}`,
      text: question.text,
      isBot: true,
      timestamp: new Date(),
      options: question.options,
      allowMultiple: question.allowMultiple,
      isInput: question.isInput
    };

    setMessages(prev => [...prev, questionMessage]);
    setCurrentQuestionIndex(questionIndex);
    setSelectedOptions([]);
  };

  const handleOptionSelect = (option: string) => {
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    
    if (currentQuestion.allowMultiple) {
      setSelectedOptions(prev => {
        if (prev.includes(option)) {
          return prev.filter(o => o !== option);
        } else {
          return [...prev, option];
        }
      });
    } else {
      setSelectedOptions([option]);
      // Auto-submit for single selection
      setTimeout(() => {
        submitResponse([option]);
      }, 500);
    }
  };

  const handleInputSubmit = () => {
    if (!input.trim()) return;
    submitResponse([input.trim()]);
    setInput("");
  };

  const submitResponse = (response: string[]) => {
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    
    // Add user response message
    const userMessage: Message = {
      id: `response-${currentQuestionIndex}`,
      text: response.join(', '),
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Update scoping data
    if (currentQuestion.field) {
      setScopingData(prev => ({
        ...prev,
        [currentQuestion.field!]: currentQuestion.allowMultiple ? response : response[0]
      }));
    }

    // Add follow-up message
    setTimeout(() => {
      const followUpMessage: Message = {
        id: `followup-${currentQuestionIndex}`,
        text: currentQuestion.followUp!,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, followUpMessage]);
      
      // Move to next question
      setTimeout(() => {
        askNextQuestion(currentQuestionIndex + 1);
      }, 1000);
    }, 500);

    setSelectedOptions([]);
  };

  const generateQuoteEstimate = (data: ScopingData) => {
    let basePrice = 5000; // Base price
    let complexity = 1;
    
    // Industry multipliers
    const industryMultipliers: { [key: string]: number } = {
      'Healthcare': 1.5,
      'Financial Services': 1.8,
      'Enterprise': 1.3,
      'Information Technology': 1.2,
      'Other': 1.0
    };
    
    // Company size multipliers
    const sizeMultipliers: { [key: string]: number } = {
      '1-50': 0.8,
      '51-200': 1.0,
      '201-500': 1.3,
      '501-1000': 1.6,
      '1000+': 2.0
    };
    
    // Infrastructure complexity
    const infraMultipliers: { [key: string]: number } = {
      'Corporate (On-premises)': 1.2,
      'Cloud (AWS, Google Cloud, etc.)': 1.1,
      'Blockchain': 1.8,
      'Hybrid': 1.5,
      'Other': 1.0
    };
    
    // Service pricing
    const servicePricing: { [key: string]: number } = {
      'Penetration Testing': 8000,
      'Network Penetration Testing': 6000,
      'Application Penetration Testing': 7000,
      'Red Teaming': 15000,
      'Cloud Security': 9000,
      'Blockchain Security': 12000,
      'SOC2 Compliance Testing': 10000,
      'Managed Security Services': 5000
    };
    
    complexity *= industryMultipliers[data.industry] || 1;
    complexity *= sizeMultipliers[data.companySize] || 1;
    complexity *= infraMultipliers[data.infrastructureType] || 1;
    
    // Calculate service costs
    let totalServiceCost = 0;
    data.cybersecurityServices.forEach(service => {
      totalServiceCost += servicePricing[service] || 3000;
    });
    
    const estimatedCost = Math.round((basePrice + totalServiceCost) * complexity);
    const lowEnd = Math.round(estimatedCost * 0.8);
    const highEnd = Math.round(estimatedCost * 1.2);
    
    return { lowEnd, highEnd, estimatedCost };
  };

  const showCompletionMessage = () => {
    const quote = generateQuoteEstimate(scopingData);
    
    const quoteMessage: Message = {
      id: 'quote',
      text: `Based on your requirements, here's a preliminary quote estimate:

**Estimated Project Cost: $${quote.lowEnd.toLocaleString()} - $${quote.highEnd.toLocaleString()}**

This estimate includes:
• ${scopingData.cybersecurityServices.join('\n• ')}
• ${scopingData.industry} industry expertise
• ${scopingData.companySize} employee organization scale
• ${scopingData.infrastructureType} infrastructure assessment

*This is a preliminary estimate. Final pricing will be provided after our team reviews your specific requirements.*`,
      isBot: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, quoteMessage]);
    
    setTimeout(() => {
      const completionMessage: Message = {
        id: 'completion',
        text: "Thank you for providing this information! Our team at White Hack Labs will review your responses and contact you with a tailored quote for our cybersecurity services, including hackerGPT solutions. For urgent inquiries, please reach out to us at (646) 450-2377 or info@whitehacklabs.com. Expect to hear from us soon!",
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, completionMessage]);
      setIsComplete(true);
    }, 2000);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidInput = () => {
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    if (currentQuestion?.field === 'contactEmail') {
      return validateEmail(input);
    }
    return input.trim().length > 0;
  };

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const showOptions = currentQuestion?.options && !currentQuestion.isInput;
  const showInput = currentQuestion?.isInput;
  const showMultipleSubmit = currentQuestion?.allowMultiple && selectedOptions.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            White Hack Labs - Cybersecurity Scoping Interview
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/20 rounded-md">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.isBot ? "" : "flex-row-reverse"}`}>
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
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {!isComplete && (
            <div className="mt-4 space-y-3">
              {showOptions && (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 gap-2">
                    {currentQuestion.options!.map((option) => (
                      <Button
                        key={option}
                        variant={selectedOptions.includes(option) ? "default" : "outline"}
                        className="justify-start text-left h-auto p-3"
                        onClick={() => handleOptionSelect(option)}
                      >
                        <div className="flex items-center gap-2">
                          {selectedOptions.includes(option) && <CheckCircle className="w-4 h-4" />}
                          <span>{option}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                  {showMultipleSubmit && (
                    <Button 
                      onClick={() => submitResponse(selectedOptions)}
                      className="w-full"
                    >
                      Continue with Selected Options
                    </Button>
                  )}
                </div>
              )}

              {showInput && (
                <div className="flex gap-2">
                  <Input
                    placeholder={currentQuestion.field === 'contactEmail' ? "Enter your email address" : "Type your response..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && isValidInput()) {
                        e.preventDefault();
                        handleInputSubmit();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleInputSubmit}
                    disabled={!isValidInput()}
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {isComplete && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Scoping Interview Complete!</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Your information has been collected and will be used to prepare your customized quote.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
