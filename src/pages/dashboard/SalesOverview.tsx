import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Package, ShoppingCart, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SKUData {
  SKU: string;
  sum: string;
}

const SalesOverview = () => {
  const { toast } = useToast();
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [salesData, setSalesData] = useState<SKUData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, []);

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
    <div className="container mx-auto px-4 py-8">
      {/* Period Selector */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sales Overview</h2>
        <Select value={period} onValueChange={(value: "weekly" | "monthly") => setPeriod(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
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
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : `Rp ${totalSales.toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground">+12% from last {period}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total SKUs</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : salesData.length}
            </div>
            <p className="text-xs text-muted-foreground">Active products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Sales/SKU</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : `Rp ${avgSales.toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground">Per product</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : topSKU ? `SKU ${topSKU.SKU}` : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {topSKU ? `Rp ${parseInt(topSKU.sum).toLocaleString()}` : "No data"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="bar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bar">Top 10 SKUs</TabsTrigger>
          <TabsTrigger value="pie">Market Share</TabsTrigger>
        </TabsList>

        <TabsContent value="bar">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Products by Sales</CardTitle>
              <CardDescription>Sales performance of top-selling SKUs</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <p className="text-muted-foreground">Loading chart data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={topSKUs}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                    <YAxis stroke="hsl(var(--foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)"
                      }}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Sales (Rp)" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pie">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Products Market Share</CardTitle>
              <CardDescription>Distribution of sales among top performers</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <p className="text-muted-foreground">Loading chart data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesOverview;
