"use client";

import { useRegisteredContract } from "@soroban-react/contracts";
import React, { useEffect, useState } from "react";
import * as StellarSdk from "@stellar/stellar-sdk";
import { useSorobanReact } from "@soroban-react/core";
import { ConnectButton } from "./web3/ConnectButton";
import Link from "next/link";
function Home() {
  const [songs, setSongs] = useState([]);
  // const [artistName, setArtistName] = useState("");
  const contract = useRegisteredContract("dapp");
  const sorobanContext = useSorobanReact();

  async function getAllSongs() {
    try {
      const result: any = await contract?.invoke({
        method: "get_songs",
        signAndSend: true,
        args: [],
      });
      if (result) {
        const result_val = StellarSdk.scValToNative(
          /// @ts-ignore
          result.returnValue as StellarSdk.xdr.ScVal
        );
        console.log("Result from contract invocation", result_val);
        setSongs(result_val);
      } else {
        console.log("No result from contract invocation");
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (sorobanContext.address) {
    return (
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex flex-col items-center justify-center w-full border-2 ">
          <h1 className="text-2xl font-bold">
            Hello, {sorobanContext.address}
          </h1>
          <div className="flex flex-col items-center justify-center"></div>
          <div className="flex flex-col items-center justify-center">
            <button
              onClick={getAllSongs}
              className="bg-black text-white p-2 m-2 hover:bg-slate-500"
            >
              Get All songs
            </button>
            <Link
              href="/addSongs"
              className="bg-black text-white p-2 m-2 hover:bg-slate-500"
            >
              Upload your own Song
            </Link>
            <ul className="grid grid-cols-3 gap-4 p-4 w-[95vw]">
              {songs.map((song, index) => {
                let song_string = song["song_string"] as String;
                let data = song_string.split("/");
                return (
                  <Link
                    href={`song/${song_string}`}
                    className="border-4 flex flex-col m-2 hover:bg-slate-50 hover:rounded-2xl transition-all bg-white px-20 h-[10rem] align-middle justify-center border-black border-solid p-2"
                    key={index}
                  >
                    <h1 className="font-bold text-4xl" key={index}>
                      {decodeURIComponent(data[0])}
                    </h1>
                    <li>By: {decodeURIComponent(data[1])}</li>
                  </Link>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h1 className="text-2xl font-bold">Please connect your wallet</h1>
        <ConnectButton />
      </div>
    );
  }
}

export default Home;
