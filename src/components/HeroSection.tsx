import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, MessageCircle } from "lucide-react";
import { policies, policyCategories } from "@/data/policies";

interface HeroSectionProps {
  onScrollToPolicies: () => void;
  onOpenChat: () => void;
}

export function HeroSection({ onScrollToPolicies, onOpenChat }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEg0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              Winston Jordan for US Congress NJ-12
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Policy Platform
              <span className="block text-patriot-red">For the People</span>
            </h1>
            <p className="max-w-3xl mx-auto text-xl sm:text-2xl text-white/90 leading-relaxed">
              Comprehensive policies to restore democracy, create economic opportunity, 
              and build a sustainable future for New Jersey's 12th Congressional District.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              variant="hero"
              onClick={onScrollToPolicies}
            >
              <ArrowDown className="w-5 h-5 mr-2" />
              Explore Policies
            </Button>
            <Button 
              size="lg"
              variant="hero-outline"
              onClick={onOpenChat}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Ask About Policies
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto pt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-patriot-red">{policies.length}</div>
              <div className="text-white/80">Specific Policies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-patriot-red">{policyCategories.length}</div>
              <div className="text-white/80">Policy Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-patriot-red">0</div>
              <div className="text-white/80">Corporate Donors</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}