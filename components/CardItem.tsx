import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  interface CardItemProps {
    title: string;
    description: string;
    value: string;
    footerText: string;
  }
  
  export function CardItem({ title, description, value, footerText }: CardItemProps) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{value}</p>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">{footerText}</p>
        </CardFooter>
      </Card>
    );
  }