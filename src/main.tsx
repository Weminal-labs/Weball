import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AptimusFlowProvider } from "aptimus-sdk-test/react";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import { UnityGameProvider } from "./contexts/UnityGameProvider.tsx";
import { AlertProvider } from "./contexts/AlertProvider.tsx";
import { WalletProvider } from "./contexts/WalletProvider.tsx";
import { AptosWalletProvider } from '@razorlabs/wallet-kit'
import '@razorlabs/wallet-kit/style.css'; // Add this line to your code

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AptimusFlowProvider apiKey="aptimus_apikey_ec23ee0a581fca24263243bc89f77bdf">
    {/* <AuthProvider> */}
      <AlertProvider>
        <AptosWalletProvider>
          <UnityGameProvider>
            <App />
          </UnityGameProvider>
        </AptosWalletProvider>
      </AlertProvider>
    {/* </AuthProvider> */}
  </AptimusFlowProvider>,
);
