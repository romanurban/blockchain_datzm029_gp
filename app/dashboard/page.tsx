import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardItem } from "@/components/CardItem";
import { ImageCard } from "@/components/ImageCard";
import { DashboardTransactions } from "@/components/DashboardTransactions";

export default function Dashboard() {
  const transactions = [
    { id: 1, date: "2023-10-01", amount: "$500" },
    { id: 2, date: "2023-09-28", amount: "$300" },
    // Add more transactions as needed
  ];

  return (
    <div className="flex-1 p-4">
      <Tabs defaultValue="overview" className="m-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          {/* First Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <CardItem
              title="Total Investments"
              description="Overall investments made"
              value="$1,234,567"
              footerText="+10% from last month"
            />
            <CardItem
              title="Active Listings"
              description="Properties currently available"
              value="123"
              footerText="+5 new listings today"
            />
            <CardItem
              title="Total Revenue"
              description="Revenue generated"
              value="$45,231.89"
              footerText="+20.1% from last month"
            />
            <CardItem
              title="Total Shares"
              description="Total number of your shares"
              value="200"
              footerText="+50% from last month"
            />
          </div>

          {/* Second Row */}
          <div className="grid gap-4 mt-4 md:grid-cols-2">
            <ImageCard imageUrl="/sample.png" altText="Descriptive Alt Text" />
            <DashboardTransactions transactions={transactions} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}