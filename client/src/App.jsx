import { EmpiricaClassic } from "@empirica/core/player/classic";
import { EmpiricaContext } from "@empirica/core/player/classic/react";
import { EmpiricaMenu, EmpiricaParticipant } from "@empirica/core/player/react";
import React from "react";
import { Game } from "./Game";
import { ExitSurvey } from "./pages/intro-exit/ExitSurvey";
import { Introduction } from "./pages/intro-exit/Introduction";
import { Lobby } from "./pages/custom-form/Lobby";
import { NoGames } from "./pages/custom-form/NoGames";
import { PlayerForm } from "./pages/custom-form/PlayerForm";
import { ConsentForm } from "./pages/custom-form/ConsentForm";

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const playerKey = urlParams.get("participantKey") || "";

  const { protocol, host } = window.location;
  const url = `${protocol}//${host}/query`;

  function introSteps({ game, player }) {
    return [Introduction];
  }

  function exitSteps({ game, player }) {
    return [ExitSurvey];
  }

  return (
    <EmpiricaParticipant url={url} ns={playerKey} modeFunc={EmpiricaClassic}>
      <div className="h-screen relative">
      {/* <EmpiricaMenu position="bottom-left" /> */}
      {(window.location.hostname != 'localhost') ? null : <EmpiricaMenu position="bottom-right" />}
        <div className="h-full overflow-auto">
          <EmpiricaContext 
            introSteps={introSteps} 
            exitSteps={exitSteps}
            // lobby={Lobby}
            playerCreate={PlayerForm}
            noGames={NoGames}
            consent={ConsentForm}
          >
            <Game />
          </EmpiricaContext>
        </div>
      </div>
    </EmpiricaParticipant>
  );
}