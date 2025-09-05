import { Button } from "@/components/ui/button";
import { ExternalLink, Shield } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-header backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Shield className="w-5 h-5" />
            HackerGPT - AI Cybersecurity Platform
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm"
              className="!bg-slate-700 !text-white !border-slate-600 hover:!bg-slate-600 hover:!text-white"
              asChild
            >
              <a href="https://whitehacklabs.com" target="_blank" rel="noopener noreferrer" className="flex items-center !text-white">
                <ExternalLink className="w-4 h-4 mr-2" />
                White Hack Labs
              </a>
            </Button>
            <Button 
              size="sm"
              className="!bg-blue-600 !text-white !border-blue-500 hover:!bg-blue-700 hover:!text-white"
              asChild
            >
              <a href="https://hackergpt.app" target="_blank" rel="noopener noreferrer" className="flex items-center !text-white">
                <ExternalLink className="w-4 h-4 mr-2" />
                HackerGPT App
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}