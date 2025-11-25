import React from "react";

export function NoGames() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-92 flex flex-col items-center">
        <img src="/fig/404.svg" alt="No games" className="w-[80] h-[80]" />
        <h2 className="text-gray-700 font-medium">There is no available task slot</h2>
        <p className="mt-2 text-gray-400 text-justify">
          There are currently no available task. Please send a message to the researcher on Prolific as soon as possible.
        </p>
      </div>
    </div>
  );
}