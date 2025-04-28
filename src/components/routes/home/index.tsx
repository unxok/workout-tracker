import { Link } from "@/components/common/routing";
import { Button } from "@/components/ui/button";
import { useGetUsername } from "@/hooks/database/auth";

export const Home = () => {
  const {
    usernameQuery: { data: username },
  } = useGetUsername();

  return (
    <div className="flex h-full w-full flex-col items-center justify-start pt-[20%] text-center">
      <h2 className="text-4xl font-bold tracking-wide md:text-5xl">
        Workout Tracker
      </h2>
      <div>A simple workout tracker built for me and my husband &lt;3</div>
      <nav className="flex w-full items-center justify-center gap-3 p-2">
        {username ? (
          <Link to={"/dashboard"}>
            <Button>dashboard</Button>
          </Link>
        ) : (
          <>
            <Link to={"/auth/signup"}>
              <Button>sign up</Button>
            </Link>
            <Link to={"/auth/login"}>
              <Button variant={"ghost"}>login</Button>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};
