"use client";

import { useRegisteredContract } from "@soroban-react/contracts";
import React, { useEffect, useState } from "react";
import * as StellarSdk from "@stellar/stellar-sdk";
import { useSorobanReact } from "@soroban-react/core";
import { ConnectButton } from "../web3/ConnectButton";
import axios from "axios";
require("dotenv").config();

function Home() {
  const contract = useRegisteredContract("dapp");
  const sorobanContext = useSorobanReact();

  const [uploadingSongToIPFS, setUploadingSongToIPFS] = useState(false);
  const [uploadingSongToBlockchain, setUploadingSongToBlockchain] =
    useState(false);
  const [artistName, setArtistName] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [artistId, setArtistId] = useState("");
  const [songUriHash, setSongUriHash] = useState("");
  const [mp3File, setMp3File] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  async function addSong(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setUploadingSongToBlockchain(true);
    if (songTitle === "" || artistName === "" || artistId === "") {
      alert("Please fill all the fields");
      return;
    }

    if (songUriHash === "") {
      alert("Please upload the song to IPFS before submitting");
    }

    const str = `${songTitle}/${artistName}/${artistId}/${songUriHash}`;

    try {
      const result = await contract?.invoke({
        method: "add_song",
        signAndSend: true,
        args: [StellarSdk.xdr.ScVal.scvString(str)],
      });

      if (result) {
        const result_val = StellarSdk.scValToNative(
          /// @ts-ignore
          result.returnValue as StellarSdk.xdr.ScVal
        );
        console.log("Result from contract invocation", result_val);
      } else {
        console.log("No result from contract invocation");
      }
    } catch (error) {
      console.log(error);
      alert("Some error occured");
    } finally {
      //   setArtistName("");
      setMessage("Your song has been uploaded to blockchain");

      setUploadingSongToBlockchain(false);
    }
  }

  async function uploadMp3toIPFS(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setUploadingSongToIPFS(true);
    if (mp3File) {
      const formData = new FormData();
      formData.append("file", mp3File);

      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: `${process.env.NEXT_PUBLIC_API_KEY}`,
          pinata_secret_api_key: `${process.env.NEXT_PUBLIC_API_SECRET}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(resFile.data.IpfsHash);
      setSongUriHash(resFile.data.IpfsHash);
      alert(`File uploaded to IPFS with hash: ${resFile.data.IpfsHash}`);
    } else {
      alert("Please select a song to upload");
    }
    setUploadingSongToIPFS(false);
    setMessage("Song uploaded to IPFS, Proceed to upload to blockchain");
  }

  if (sorobanContext.address) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">
            Hello, {sorobanContext.address}
          </h1>
          <form className="flex flex-col mt-16">
            <input
              type="text"
              placeholder="Artist Name"
              onChange={(e) => setArtistName(e.target.value)}
              value={artistName}
              className="border-2 border-black p-2 m-2"
            />
            <input
              type="text"
              placeholder="Song Title"
              onChange={(e) => setSongTitle(e.target.value)}
              value={songTitle}
              className="border-2 border-black p-2 m-2"
            />
            <input
              type="text"
              placeholder="Mobile Number"
              onChange={(e) => setArtistId(e.target.value)}
              value={artistId}
              className="border-2 border-black p-2 m-2"
            />
            <input
              type="file"
              accept="audio/mp3"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setMp3File(file);
                }
              }}
              className="border-2 border-black p-2 m-2"
            />
            {songUriHash === "" && (
              <button
                className="bg-black text-white p-2 m-2 hover:bg-slate-500"
                onClick={uploadMp3toIPFS}
              >
                Upload Song to IPFS
              </button>
            )}

            {mp3File && songUriHash !== "" && (
              <button
                onClick={addSong}
                className="bg-black text-white p-2 m-2 hover:bg-slate-500"
              >
                Add Song
              </button>
            )}

            {uploadingSongToIPFS && <h1>Uplaoding Song to IPFS</h1>}
            {uploadingSongToBlockchain && (
              <h1>Uplaoding Song to to Blockchain</h1>
            )}
            <h1>{message}</h1>
          </form>
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
