import { Dumbbell, ChartColumn, User2 } from "lucide-react";
import { useState, ReactNode, MouseEventHandler } from "react";
import { Outlet } from "react-router";
import {
  NavLinkProps as BaseNavLinkProps,
  NavLink as BaseNavLink,
} from "@/components/common/routing";

export const DashboardLayout = () => (
  <>
    <AsideNav />
    <main>
      <Outlet />
    </main>
  </>
);

const AsideNav = () => {
  const [width, setWidth] = useState<number>();
  const [isResizing, setIsResizing] = useState(false);

  const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    document.body.style.setProperty("user-select", "none");
    document.body.style.setProperty("cursor", "ew-resize");
    setIsResizing(true);
    let startingX = e.pageX;
    const onMouseMove = (e: MouseEvent) => {
      const diff = e.pageX - startingX;
      setWidth((prev) => (prev === undefined ? startingX : prev + diff));
      startingX = e.pageX;
    };
    const onMouseUp = () => {
      document.body.style.removeProperty("user-select");
      document.body.style.removeProperty("cursor");
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      setIsResizing(false);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <aside className="flex h-full justify-between overflow-x-hidden">
      <nav
        className="flex flex-col gap-3 px-4 py-2"
        style={
          width === undefined
            ? {}
            : {
                width: width,
                // minWidth: width,
              }
        }
      >
        <NavLink icon={<Dumbbell />} to={"/"}>
          Workouts
        </NavLink>
        <NavLink icon={<ChartColumn />} to={"/"}>
          Statistics
        </NavLink>
        <NavLink icon={<User2 />} to={"/profile"}>
          Profile
        </NavLink>
      </nav>
      <div
        className="group flex h-full w-2 cursor-ew-resize justify-center"
        data-is-resizing={isResizing}
        onDoubleClick={() => setWidth(undefined)}
        onMouseDown={onMouseDown}
      >
        <div className="group-hover:bg-primary/50 group-data-[is-resizing=true]:bg-primary/50 bg-muted-foreground/50 h-full w-0.25" />
      </div>
    </aside>
  );
};

type NavLinkProps = BaseNavLinkProps & {
  icon: ReactNode;
  children: ReactNode;
};
const NavLink = ({ icon, children, ...props }: NavLinkProps) => (
  <BaseNavLink {...props}>
    <div className="flex w-full min-w-fit items-center justify-start gap-2 rounded-md border p-3">
      <span>{icon}</span>
      <span>{children}</span>
    </div>
  </BaseNavLink>
);
