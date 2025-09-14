import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { tools, toolCategories } from "@/data/tools";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Shield, Zap, Crown, Target, FileText } from "lucide-react";
import { HackerGPTChat } from "@/components/HackerGPTChat";
import { ScopingChat } from "@/components/ScopingChat";

const Index = () => {
  const [showChat, setShowChat] = useState(false);
  const [showScopingChat, setShowScopingChat] = useState(false);

  const scrollToTools = () => {
    document.getElementById('tools-section')?.scrollIntoView({ behavior: "smooth" });
  };

  const getCategoryCount = (category: string) => {
    return tools.filter(t => t.category === category).length;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Network Scanning': return <Target className="w-5 h-5" />;
      case 'OSINT & Discovery': return <Shield className="w-5 h-5" />;
      case 'Vulnerability Assessment': return <Zap className="w-5 h-5" />;
      case 'Premium OSINT': return <Crown className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <Header />
      <HeroSection 
        onScrollToPolicies={scrollToTools}
        onOpenChat={() => setShowChat(true)}
      />

      {/* Tool Categories Overview */}
      <section className="py-16 bg-muted/30" id="tools-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              🛡️ HackerGPT Tool Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover our comprehensive suite of AI-powered cybersecurity tools designed for professionals, researchers, and organizations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolCategories.map((category) => {
              const categoryTools = tools.filter(t => t.category === category);
              const premiumCount = categoryTools.filter(t => t.isPremium).length;
              
              return (
                <div key={category} className="bg-background rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    {getCategoryIcon(category)}
                    <h3 className="text-xl font-semibold">{category}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {categoryTools.length} tools available
                    {premiumCount > 0 && (
                      <span className="ml-2">
                        <Badge variant="secondary" className="text-xs">
                          <Crown className="w-3 h-3 mr-1" />
                          {premiumCount} Premium
                        </Badge>
                      </span>
                    )}
                  </p>
                  <div className="space-y-2">
                    {categoryTools.slice(0, 3).map((tool) => (
                      <div key={tool.id} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="flex-1">{tool.title}</span>
                        {tool.isPremium && <Crown className="w-3 h-3 text-amber-500" />}
                      </div>
                    ))}
                    {categoryTools.length > 3 && (
                      <p className="text-xs text-muted-foreground">+{categoryTools.length - 3} more tools</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              🚀 Why Choose HackerGPT?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Experience the future of cybersecurity with AI-powered automation, advanced OSINT capabilities, and professional-grade tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Automation</h3>
              <p className="text-muted-foreground">
                Automate complex OSINT and penetration testing tasks with conversational AI that understands security contexts.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional Grade</h3>
              <p className="text-muted-foreground">
                Trusted by security professionals worldwide for penetration testing, compliance audits, and threat intelligence.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Features</h3>
              <p className="text-muted-foreground">
                Access advanced tools like dark web monitoring, comprehensive breach searches, and cryptocurrency forensics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            🎯 Ready to Upgrade Your Security Capabilities?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get a personalized cybersecurity quote from White Hack Labs or chat with our AI assistant to learn about HackerGPT's tools and capabilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => setShowScopingChat(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <FileText className="w-5 h-5 mr-2" />
              Get Custom Quote
            </Button>
            <Button 
              size="lg"
              onClick={() => setShowChat(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat with AI Assistant
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => window.open('https://hackergpt.app', '_blank')}
            >
              <Crown className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Join thousands of security professionals using HackerGPT
          </p>
        </div>
      </section>

      <HackerGPTChat open={showChat} onOpenChange={setShowChat} />
      <ScopingChat open={showScopingChat} onOpenChange={setShowScopingChat} />
      <Footer />
    </div>
  );
};

export default Index;
