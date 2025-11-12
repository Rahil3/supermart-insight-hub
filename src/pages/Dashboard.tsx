import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Package, ShoppingCart, BarChart3, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@/assets/super-indo-logo.png";

interface SKUData {
  SKU: string;
  sum: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [salesData, setSalesData] = useState<SKUData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/auth");
      return;
    }

    fetchSalesData();
  }, [navigate]);

  const fetchSalesData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://asia-south1.workflow.boltic.app/b531bc6e-11c5-4cf3-a910-443f37ef9e42");
      const data = await response.json();
      setSalesData(data.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sales data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/auth");
  };

  // Transform data for charts
  const topSKUs = salesData
    .sort((a, b) => parseInt(b.sum) - parseInt(a.sum))
    .slice(0, 10)
    .map(item => ({
      name: `SKU ${item.SKU}`,
      value: parseInt(item.sum),
    }));

  const pieChartData = salesData
    .sort((a, b) => parseInt(b.sum) - parseInt(a.sum))
    .slice(0, 5)
    .map(item => ({
      name: `SKU ${item.SKU}`,
      value: parseInt(item.sum),
    }));

  const totalSales = salesData.reduce((acc, item) => acc + parseInt(item.sum), 0);
  const avgSales = salesData.length > 0 ? Math.round(totalSales / salesData.length) : 0;
  const topSKU = salesData.length > 0 ? salesData.sort((a, b) => parseInt(b.sum) - parseInt(a.sum))[0] : null;

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logoImage} alt="Super Indo" className="h-10 object-contain" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-sm text-muted-foreground">Retail Performance Insights</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Period Selector */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Sales Overview</h2>
          <Select value={period} onValueChange={(value: "weekly" | "monthly") => setPeriod(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {(totalSales / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-muted-foreground">Across all SKUs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total SKUs</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesData.length}</div>
              <p className="text-xs text-muted-foreground">Products tracked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Sales/SKU</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {(avgSales / 1000).toFixed(0)}K</div>
              <p className="text-xs text-muted-foreground">Per product</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">SKU {topSKU?.SKU || "N/A"}</div>
              <p className="text-xs text-muted-foreground">Rp {topSKU ? (parseInt(topSKU.sum) / 1000000).toFixed(1) : "0"}M</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="bar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bar">Top 10 SKUs</TabsTrigger>
            <TabsTrigger value="pie">Market Share</TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top 10 SKUs by Sales</CardTitle>
                <CardDescription>Highest performing products in the current period</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground">Loading data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={topSKUs}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)"
                        }}
                      />
                      <Legend />
                      <Bar dataKey="value" fill="hsl(var(--primary))" name="Sales (Rp)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pie" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 SKUs Market Share</CardTitle>
                <CardDescription>Distribution of sales among top performers</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground">Loading data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        outerRadius={120}
                        fill="hsl(var(--primary))"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)"
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
