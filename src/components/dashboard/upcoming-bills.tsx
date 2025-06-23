import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { upcomingBills } from "@/lib/data";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export function UpcomingBills() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Bills</CardTitle>
        <CardDescription>Don't miss these payment deadlines.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {upcomingBills.map((bill) => (
            <li key={bill.name} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <bill.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{bill.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Due {format(new Date(bill.dueDate), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${bill.amount.toFixed(2)}</p>
                <Button variant="link" size="sm" className="h-auto p-0 text-primary">Pay Now</Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
