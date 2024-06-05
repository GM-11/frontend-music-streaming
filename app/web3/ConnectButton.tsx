"use client";
import { useSorobanReact } from "@soroban-react/core";

export const ConnectButton = () => {
  const sorobanContext = useSorobanReact();
  const { activeChain, address, disconnect, setActiveConnectorAndConnect } =
    sorobanContext;
  const activeAccount = address;
  const browserWallets = sorobanContext.connectors;
  if (!activeAccount)
    return (
      <div className="text-white justify-center align-middle flex flex-col">
        {!activeAccount && <p className="">Connect wallet to continue</p>}
        {!activeAccount &&
          browserWallets.map((w) => (
            <button
              className="bg-white rounded-full hover:bg-slate-50 p-4 text-black"
              key={w.name}
              onClick={() => {
                setActiveConnectorAndConnect && setActiveConnectorAndConnect(w);
              }}
            >
              {w.name}
            </button>
          ))}
      </div>
    );

  return (
    <div className="w-full p-4 border-b-black border-t-transparent border-r-transparent border-l-transparent border-2 text-white text-lg flex flex-col align-middle justify-center">
      <p>
        Wallet Address: <b>{address}</b>
      </p>
      {/* <div
        key={supportedChains[0].name}
        // isDisabled={chain.network === activeChain?.network}
        onClick={() => {
          // toast.error(`Not implemented yet. Please switch chain via the wallet extension.`)
          setActiveChain && setActiveChain(supportedChains[0]);
        }}
      >
        <p>{supportedChains[0].name}</p>
      </div> */}
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full w-min"
        onClick={async () => {
          console.log("Disconnecting");
          await disconnect();
        }}
      >
        Disconnect
      </button>
    </div>
  );
};