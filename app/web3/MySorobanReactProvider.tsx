"use client";

import React from "react";
import { SorobanReactProvider } from "@soroban-react/core";
import { testnet } from "@soroban-react/chains";
import { freighter } from "@soroban-react/freighter";
import type { ChainMetadata, Connector } from "@soroban-react/types";

// import deployments from "../../../contracts/hello_world/deployments.json";

const deployments = [
  {
    contractId: "dapp",
    networkPassphrase: "Test SDF Network ; September 2015",
    contractAddress: "CBZIEGAC27UIEXQTG3F6NGGEV7BY4ECPLSYP5OGEIZKCKE6ZUZ5A5MJC",
  },
];

const chains: ChainMetadata[] = [testnet];
const connectors: Connector[] = [freighter()];

export default function MySorobanReactProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SorobanReactProvider
      chains={chains}
      appName={"Tossing App"}
      activeChain={testnet}
      connectors={connectors}
      deployments={deployments}
    >
      {children}
    </SorobanReactProvider>
  );
}