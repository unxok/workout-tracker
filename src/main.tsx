import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { RootLayout } from "./components/rootLayout/index.tsx";
import { ThemeProvider } from "./components/common/ThemeProvider/index.tsx";
import { Home } from "./components/routes/home/index.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Signup } from "./components/routes/auth/signup/index.tsx";
import { Login } from "./components/routes/auth/login/index.tsx";
import { ResetPasswordLayout } from "./components/routes/auth/reset-password/layout.tsx";
import { ResetPassword } from "./components/routes/auth/reset-password/index.tsx";
import { Profile } from "./components/routes/profile/index.tsx";
import { Programs } from "./components/routes/programs/index.tsx";
import { ProgramsId } from "./components/routes/programs/~id/index.tsx";
import { Exercises } from "./components/routes/exercises/index.tsx";

const queryClient = new QueryClient();

const paths = {
  index: "/",
  signup: "/auth/signup",
  login: "/auth/login",
  resetPassword: "/auth/reset-password",
  dashboard: "/dashboard",
  profile: "/profile",
  programs: "/programs",
  exercises: "/exercises",
} satisfies Record<string, `/${string}`>;

export type Path = (typeof paths)[keyof typeof paths];

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename="/workout-tracker">
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="auth">
                <Route path="signup" element={<Signup />} />
                <Route path="login" element={<Login />} />
                <Route path="reset-password">
                  <Route element={<ResetPasswordLayout />}>
                    <Route index element={<ResetPassword />} />
                  </Route>
                </Route>
              </Route>
              <Route path="programs" element={<Programs />} />
              <Route path="programs/:id" element={<ProgramsId />} />
              <Route path="profile" element={<Profile />} />
              <Route path="exercises" element={<Exercises />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
