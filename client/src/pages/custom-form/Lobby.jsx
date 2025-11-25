import React, { useState, useEffect } from "react";
import { 
    useGame
} from "@empirica/core/player/classic/react";
import { msToTime } from "../../utils/formatting";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export function Lobby() {
    const game = useGame();

    let lobbyTimeout = game.get("lobbyTimeout") || false;
    const [timeRemaining, setTimeRemaining] = useState(
        "being calculated"
    );
    // Run on component load
    useEffect(() => {
        // Start a timer that we can show in the UI
        if (!lobbyTimeout) {
            game.set("startLobby", true);
            lobbyTimeout = Date.now() + parseInt(game.get("lobbyDuration")) / 1000 / 1000;
        } else {
            lobbyTimeout = new Date(lobbyTimeout);
        }

        // Poll the timer
        const interval = setInterval(() => {
            const now = new Date();
            const diffMS = lobbyTimeout - now;

            setTimeRemaining(msToTime(diffMS));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    let lobbyUI;
    lobbyUI = (
        <div className="flex flex-col justify-center items-center h-full w-full text-center text-2xl font-sans">
            <DotLottieReact
                src="/json/lobby.json"
                loop
                autoplay
                className="w-[50vw] mx-auto"
            />
            <div className="mt-4">
                <p>Finding your partner...</p>
            </div>
            <div className="text-base mt-2 text-neutral-400">
                Task will start in {timeRemaining}
            </div>
        </div>
    );

  return (
    <>
        <div className="flex flex-col justify-center items-center h-full w-full text-center text-2xl font-sans">
            {lobbyUI}
        </div>
    </>
  );
}