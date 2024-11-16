import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"

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

          <Card>
              <CardHeader>
                <CardTitle>Total Investments</CardTitle>
                <CardDescription>Overall investments made</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">$1,234,567</p>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">+10% from last month</p>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Listings</CardTitle>
                <CardDescription>Properties currently available</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">123</p>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">+5 new listings today</p>
              </CardFooter>
            </Card>

          <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
                <CardDescription>Revenue generated</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">$45,231.89</p>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New Users</CardTitle>
                <CardDescription>Users joined this month</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">350</p>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">+50% from last month</p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Analytics</h2>
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
              <svg width="100%" height="100%" viewBox="0 0 400 200">
                <rect width="100%" height="100%" fill="#e2e8f0" />
                <rect x="50" y="50" width="50" height="100" fill="#4a5568" />
                <rect x="150" y="30" width="50" height="120" fill="#4a5568" />
                <rect x="250" y="70" width="50" height="80" fill="#4a5568" />
                <rect x="350" y="90" width="50" height="60" fill="#4a5568" />
              </svg>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}