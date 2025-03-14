"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

const LoginButton = () => {
  return (
    <Button
      onClick={() => signIn("google")}
      variant="outline"
      className="cursor-pointer"
    >
      Acceder
    </Button>
  );
};

export { LoginButton };
