import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Policy } from "@/data/policies";

interface PolicyCardProps {
  policy: Policy;
  onClick?: () => void;
}

export function PolicyCard({ policy, onClick }: PolicyCardProps) {
  return (
    <Card 
      className="hover:shadow-campaign transition-all duration-300 cursor-pointer group border-border/50 hover:border-primary/30"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <Badge variant="secondary" className="mb-2 text-xs">
              {policy.id}
            </Badge>
            <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
              {policy.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm leading-relaxed">
          {policy.description}
        </CardDescription>
        {policy.localizedExample && (
          <div className="mt-3 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium text-patriot-blue">
              Local Impact:
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {policy.localizedExample}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}