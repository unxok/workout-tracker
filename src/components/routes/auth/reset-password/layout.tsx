import { Outlet } from "react-router";

export const ResetPasswordLayout = () => {
  return (
    <div className="flex h-full w-full items-start justify-center">
      <div className="min-w-[45ch] pt-28">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-wide">Reset password</h2>
          <div>Don't worry about it, we all forget things sometimes :p</div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
