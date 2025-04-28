import { Outlet } from "react-router";
import { ThemeToggle } from "../common/ThemeToggle";
import { Toaster } from "../ui/sonner";
import {
  BarChart3,
  ChevronUp,
  Dumbbell,
  NotebookPen,
  NotebookText,
  User2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Link, NavLink, useNavigate } from "@/components/common/routing";
import { db } from "@/lib/supabase";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ReactNode } from "react";
import { Path } from "@/main";
import { useGetUsername } from "@/hooks/database/auth";
import { MuscleIcon } from "../common/MuscleIcon";

export const RootLayout = () => (
  <SidebarProvider>
    <div className="fixed inset-0 flex">
      <NavSidebar />
      <main className="@container/main relative flex h-full w-full overflow-y-auto">
        <SidebarTrigger className="absolute top-0 left-0" />
        <ThemeToggle className="fixed top-0.5 right-0.5 flex size-7 items-center justify-center" />
        <Outlet />
      </main>
      <Toaster />
    </div>
  </SidebarProvider>
);

const AuthFooter = () => {
  const nav = useNavigate();

  const {
    usernameQuery: { data: username },
    userQuery: { refetch },
  } = useGetUsername();

  return username ? (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton>
            <User2 /> {username}
            <ChevronUp className="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          className="w-[--radix-popper-anchor-width]"
        >
          <Link to={"/profile"}>
            <DropdownMenuItem>
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            onClick={async () => {
              await db.auth.signOut();
              nav("/auth/login");
              refetch();
            }}
          >
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  ) : (
    <SidebarMenuItem>
      <div className="flex w-full items-center justify-center gap-1">
        <Link to={"/auth/signup"} className="w-full">
          <Button className="w-full">sign up</Button>
        </Link>
        <Link to={"/auth/login"} className="w-full">
          <Button variant={"ghost"} className="w-full">
            login
          </Button>
        </Link>
      </div>
    </SidebarMenuItem>
  );
};

const NavSidebarItemLink = ({
  icon,
  title,
  to,
}: {
  icon: ReactNode;
  title: string;
  to: Path;
}) => (
  <SidebarMenuItem>
    <NavLink to={to}>
      <SidebarMenuButton>
        {icon}
        {title}
      </SidebarMenuButton>
    </NavLink>
  </SidebarMenuItem>
);

const NavSidebar = () => {
  //
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link to="/">
              <Dumbbell />
              <h1 className="text-lg font-semibold tracking-wide whitespace-nowrap">
                Workout Tracker
              </h1>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavSidebarItemLink icon={<NotebookPen />} title="Log" to="/" />
              <NavSidebarItemLink
                icon={<NotebookText />}
                title="Programs"
                to="/programs"
              />
              <NavSidebarItemLink
                icon={<MuscleIcon />}
                title="Exercises"
                to="/exercises"
              />
              <NavSidebarItemLink icon={<BarChart3 />} title="Stats" to="/" />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <AuthFooter />
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
