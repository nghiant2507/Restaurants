import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '~/core/components/ui/card';

export const LoadingCard = () => {
  return (
    <Card className="group relative flex flex-col h-full animate-pulse">
      <CardHeader className="p-0">
        <div className="relative w-full aspect-[3/2] bg-muted" />
      </CardHeader>
      <CardContent className="flex-1 grid gap-3 p-4">
        <div className="h-6 bg-muted rounded-md w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded-md w-full" />
          <div className="h-4 bg-muted rounded-md w-5/6" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="w-full h-10 bg-muted rounded-md" />
      </CardFooter>
    </Card>
  );
};
