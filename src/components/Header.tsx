import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-header backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <div className="text-white font-semibold">
            Winston Jordan for Congress - Policy Platform
          </div>
          <Button 
            variant="hero-outline"
            size="sm"
            asChild
          >
            <a href="https://winstonforcongress.com" className="flex items-center">
              <ExternalLink className="w-4 h-4 mr-2" />
              Back to Main Site
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}