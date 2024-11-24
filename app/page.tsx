import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardItem } from "@/components/CardItem";

export default function Home() {
  return (
    <div className="max-w-screen-lg w-full m-[10px] mx-auto overflow-hidden rounded-[0.5rem] border bg-background shadow">
      <Tabs defaultValue="overview" className="m-[10px]">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
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
              title="Total shares"
              description="Total number of your shares"
              value="200"
              footerText="+50% from last month"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}