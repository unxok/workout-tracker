import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Ellipsis } from "lucide-react";
import { ReactNode } from "react";

export type ProgramCardPresentationalProps = {
  elipsesDropdownMenuContent: ReactNode;
  cardTitle: ReactNode;
  createdAt: ReactNode;
  updatedAt: ReactNode;
  notes: ReactNode;
  link: ReactNode;
  cardProps?: React.ComponentProps<"div">;
};
export const ProgramCardPresentational = ({
  elipsesDropdownMenuContent,
  cardTitle,
  createdAt,
  updatedAt,
  notes,
  link,
  cardProps,
}: ProgramCardPresentationalProps) => (
  <Card
    {...cardProps}
    className={cn("relative w-full @[40rem]/main:w-64", cardProps?.className)}
  >
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="absolute top-0 right-0" variant={"ghost"}>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      {elipsesDropdownMenuContent}
    </DropdownMenu>
    <CardHeader className="w-full">
      {cardTitle}
      <CardDescription>
        {createdAt}
        {updatedAt}
      </CardDescription>
    </CardHeader>
    <CardContent className="flex h-[2lh] w-full flex-col items-center justify-center">
      {notes}
    </CardContent>
    <CardFooter className="w-full">{link}</CardFooter>
  </Card>
);
