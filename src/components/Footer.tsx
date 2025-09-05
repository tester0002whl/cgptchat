import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-democracy-blue/95 backdrop-blur-sm text-white py-4 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="text-center sm:text-left">
            <div className="font-semibold">Winston Jordan for Congress</div>
            <div className="text-white/80 text-sm">New Jersey's 12th Congressional District</div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="footer-ghost" size="sm" className="h-auto py-1" asChild>
              <a href="https://winstonforcongress.com" className="flex items-center">
                <ExternalLink className="w-3 h-3 mr-1" />
                Main Campaign Site
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}