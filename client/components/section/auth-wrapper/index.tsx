"use client";
import HeaderAppBar from "@/components/section/auth-wrapper/app-bar";
import { Container } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const AuthWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const pathname = usePathname();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const ignorePages = ["/login", "/register"];
    const getAccessToken = localStorage.getItem("accessToken");
    if (!getAccessToken && !ignorePages.includes(pathname)) {
      router.replace("/login");
    }

    setAccessToken(getAccessToken);
  }, [pathname, router]);

  return (
    <>
      {accessToken && <HeaderAppBar />}
      <Container>{children}</Container>
    </>
  );
};

export default AuthWrapper;
