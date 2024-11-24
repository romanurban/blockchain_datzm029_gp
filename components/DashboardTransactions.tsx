import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Transaction {
  id: number;
  date: string;
  amount: string;
}

interface DashboardTransactionsProps {
  transactions: Transaction[];
}

export function DashboardTransactions({ transactions }: DashboardTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {transactions.map((tx) => (
            <li key={tx.id} className="py-2 border-b">
              <div className="flex justify-between">
                <span>{tx.date}</span>
                <span>{tx.amount}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}