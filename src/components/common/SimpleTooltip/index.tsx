import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";

export const SimpleTooltip = ({
  children,
  msg,
}: {
  children: ReactNode;
  msg: ReactNode;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{msg}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
