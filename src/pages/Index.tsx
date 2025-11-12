import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Package, ShoppingCart } from "lucide-react";
import logoImage from "@/assets/super-indo-logo.png";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center space-y-8">
          <img src={logoImage} alt="Super Indo" className="h-20 object-contain" />
          
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-5xl font-bold text-foreground">
              Super Indo Analytics
            </h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive retail analytics platform for tracking sales, inventory, and market performance across all stores
            </p>
          </div>

          <Button 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => navigate("/auth")}
          >
            Access Dashboard
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <div className="bg-card p-6 rounded-lg border-2 hover:border-primary transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Sales Tracking</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Monitor sales data per SKU across all stores with weekly and monthly breakdowns
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border-2 hover:border-primary transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Package className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg">Inventory Control</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Track stock levels at stores and distribution centers in real-time
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border-2 hover:border-primary transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-chart-3/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-chart-3" />
              </div>
              <h3 className="font-semibold text-lg">Market Analysis</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Analyze market share and compare brand performance across categories
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border-2 hover:border-primary transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-chart-4/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-chart-4" />
              </div>
              <h3 className="font-semibold text-lg">Visual Reports</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Interactive charts and dashboards for data-driven decision making
            </p>
          </div>
        </div>

        {/* Data Types Section */}
        <div className="mt-20 bg-card rounded-lg border-2 p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Available KPIs & Data</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <h4 className="font-semibold">Sales Data per SKU</h4>
                  <p className="text-sm text-muted-foreground">Weekly and Monthly | Per Store Data</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <h4 className="font-semibold">Purchase & Return Data</h4>
                  <p className="text-sm text-muted-foreground">Per Store and Distribution Center</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <h4 className="font-semibold">Service Level Metrics</h4>
                  <p className="text-sm text-muted-foreground">Comparing ordered vs received quantities</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                <div>
                  <h4 className="font-semibold">Stock/Inventory Data</h4>
                  <p className="text-sm text-muted-foreground">Real-time stock quantities per location</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                <div>
                  <h4 className="font-semibold">Market Share Analysis</h4>
                  <p className="text-sm text-muted-foreground">Brand performance vs category totals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
