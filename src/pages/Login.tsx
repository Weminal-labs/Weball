import React from "react";
import { useAptimusFlow } from "aptimus-sdk-test/react";
import "../index.css";
import { FcGoogle } from "react-icons/fc";

export const LoginPage = () => {
  const flow = useAptimusFlow();

  const startLogin = async () => {
    console.log(window.location.origin)
    const url = await flow.createAuthorizationURL({
      provider: "google",
      clientId:
        "898060815188-os2kha196hocdsuqpjhao3r52d4k9tkk.apps.googleusercontent.com",
      redirectUrl: `${window.location.origin}/callback`,
    });
    window.location.href = url.toString();
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className="flex cursor-pointer gap-2 rounded-lg bg-white px-4 py-2 font-semibold text-blue-500 shadow-md hover:bg-blue-700 hover:text-white"
        onClick={startLogin}
      >
        <FcGoogle size={"2.5rem"}></FcGoogle>
        <p className="blinking self-center font-bold ">
          {" "}
          Sign in with Google
        </p>
      </div>
    </div>
  );
};
