import { useGetUser } from "@/hooks/database/auth";
import { Path } from "@/main";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";
import {
  Link as BaseLink,
  NavLink as BaseNavLink,
  LinkProps as BaseLinkProps,
  NavLinkProps as BaseNavLinkProps,
  NavigateOptions,
  useNavigate as baseUseNavigate,
} from "react-router";

export type LinkProps = BaseLinkProps & { to: Path | `${Path}/${string}` };
export const Link = (props: LinkProps) => <BaseLink {...props} />;

export type NavLinkProps = BaseNavLinkProps & {
  to: Path | `${Path}/${string}`;
};
export const NavLink = (props: NavLinkProps) => <BaseNavLink {...props} />;

export const useNavigate = () => {
  const nav = baseUseNavigate();
  return nav as (to: Path, options?: NavigateOptions) => void;
};

export const AuthProtected = ({
  element,
  redirectTo,
  fallback,
}: {
  element: ReactNode;
  redirectTo: Path;
  fallback?: ReactNode;
}) => {
  const nav = useNavigate();

  const { data, isPending, isSuccess } = useGetUser();

  return (
    <>
      {isPending && fallback && <>{fallback}</>}
      {isPending && !fallback && (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {isSuccess && !data && <div ref={() => nav(redirectTo)} />}
      {isSuccess && !!data && <>{element}</>}
    </>
  );
};
