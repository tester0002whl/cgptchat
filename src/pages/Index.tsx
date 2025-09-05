import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { PolicySearch } from "@/components/PolicySearch"; 
import { PolicyCard } from "@/components/PolicyCard";
import { policies, policyCategories } from "@/data/policies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { PolicyChat } from "@/components/PolicyChat";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showChat, setShowChat] = useState(false);
  const policiesRef = useRef<HTMLDivElement>(null);

  const normalizeCategory = (c: string) => (c === "Economic Opportunity" ? "Economic Guarantees" : c);

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch = 
      policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.localizedExample.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "all" || normalizeCategory(policy.category) === normalizeCategory(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const scrollToPolicies = () => {
    policiesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getCategoryCount = (category: string) => {
    return policies.filter(p => normalizeCategory(p.category) === category).length;
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <Header />
      <HeroSection 
        onScrollToPolicies={scrollToPolicies}
        onOpenChat={() => setShowChat(true)}
      />

      {/* Policy Categories Overview */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Policy Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive coverage across all areas that matter to NJ-12 constituents
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {policyCategories.map((category) => (
              <Button
                key={category}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2 hover:border-primary/50 transition-colors"
                onClick={() => {
                  setSelectedCategory(category);
                  scrollToPolicies();
                }}
              >
                <div className="font-medium text-left">{category}</div>
                <Badge variant="secondary" className="text-xs">
                  {getCategoryCount(category)} policies
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Search and Results */}
      <section ref={policiesRef} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">
              Search & Explore Policies
            </h2>
            <PolicySearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* Results */}
          <div className="space-y-6">
            {selectedCategory !== "all" && (
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">
                  {selectedCategory}
                </h3>
                <Badge variant="outline">
                  {filteredPolicies.length} policies
                </Badge>
              </div>
            )}

            {filteredPolicies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No policies found matching your search criteria.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPolicies.map((policy) => (
                  <PolicyCard 
                    key={policy.id} 
                    policy={policy}
                    onClick={() => {
                      // Future: Navigate to detailed policy page
                      console.log("Policy clicked:", policy.id);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* AI Chat Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Have Questions About These Policies?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our AI assistant can help explain any policy, compare positions, 
            or answer questions about how these policies would impact you.
          </p>
          <Button 
            size="lg"
            onClick={() => setShowChat(true)}
            className="bg-patriot-blue hover:bg-patriot-blue/90"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Chat About Policies
          </Button>
        </div>
      </section>

      <PolicyChat open={showChat} onOpenChange={setShowChat} />
      <Footer />
    </div>
  );
};

export default Index;
