"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";

function Page() {
  const router = useParams();
  const [song_title, artist_name, artist_id, song_uri_hash] =
    router.songData as [string, string, string, string];
  const music_uri = `https://ivory-absolute-pony-623.mypinata.cloud/ipfs/${song_uri_hash}`;
  return (
    <div className="flex flex-col justify-center h-[100vh] w-[100vw] align-middle p-16">
      <h1 className="font-bold text-3xl">{decodeURIComponent(song_title)}</h1>
      <h1>By: {decodeURIComponent(artist_name)}</h1>
      <audio controls>
        <source id="audio-player" src={music_uri} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default Page;
