// import React from "react";
import { useAptimusFlow } from "aptimus-sdk-test/react";

export const LoginPage = () => {
  const flow = useAptimusFlow();

  const startLogin = async () => {
    const url = await flow.createAuthorizationURL({
      provider: "google",
      clientId:
        "898060815188-os2kha196hocdsuqpjhao3r52d4k9tkk.apps.googleusercontent.com",
      redirectUrl: `${window.location.origin}/callback`,
    });
    console.log(url);
    window.location.href = url.toString();
  };

  return (
    <div style={{
      backgroundImage: "url('../public/bg.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      width: "100%",
      height: "100vh",
      overflow: "hidden",

    }}>
      <button
        className="flex justify-center items-center border border-gray-300 rounded-lg px-8 py-2 text-gray-700 hover:bg-gray-100 hover:shadow-sm active:bg-gray-50 active:scale-95 transition-all"
        onClick={startLogin}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
          alt="Google logo"
          className="w-6 h-6 mr-2"
        />
        Sign in with Google
      </button>
    </div>


  );
};
