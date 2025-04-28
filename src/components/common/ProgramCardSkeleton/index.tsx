import { Skeleton } from "@/components/ui/skeleton";
import { ProgramCardPresentational } from "../ProgramCardPresentational";

export const ProgramCardSkeleton = ({
  cardProps,
}: {
  cardProps?: React.ComponentProps<"div">;
}) => (
  <ProgramCardPresentational
    elipsesDropdownMenuContent={<></>}
    cardTitle={<Skeleton className="h-4 w-5/6" />}
    createdAt={<Skeleton className="h-4 w-24" />}
    updatedAt={<Skeleton className="mt-1 h-4 w-24" />}
    notes={
      <div className="flex h-full w-full flex-col gap-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    }
    link={<Skeleton className="ml-auto h-4 w-8" />}
    cardProps={cardProps}
  />
);
