import React, { useEffect } from "react";
import {
    useGame,
    usePlayer,
    useStage
} from "@empirica/core/player/classic/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Unplug } from '@/components/animate-ui/icons/unplug';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { getPredictor } from "@/utils/predictor.js";

export function ResultUI() {
    const game = useGame();
    const treatment = game.get("treatment");
    const p = getPredictor(treatment);
    const player = usePlayer();
    const playerAvatar = player.get("avatar");
    const playerDecision = player.round.get("decision");
    const drawnLabel = (p.usesFixedContents) ? treatment.aiPrediction : player.round.get("drawnLabel")
    // console.log(drawnLabel);

    const stage = useStage();
    const stageName = stage.get("name");

    useEffect(() => {
        if (stageName === "result") {
            player.round.set("pdStep", "finished");
        }
    }, []);

    if (stageName !== "result") {
        return null;
    }

    const resultUI = (
        <>
            <div className="flex">
                <div className="w-64">
                    <div className="flex h-full items-start bg-white p-3 rounded-xl shadow border-1 border-neutral-200">
                        <div className="flex flex-col items-center">
                            <Avatar className="mx-2 border-1 border-neutral-200">
                                <AvatarImage src={`fig/icon/user/silhouette.svg`} />
                                <AvatarFallback></AvatarFallback>
                            </Avatar>
                            <div className="text-normal font-semibold text-neutral-800">You</div>
                        </div>
                        <div className="border-l-1 border-gray-200 h-30 ml-1 mr-3 my-auto"></div>
                        <div className="flex flex-col items-start gap-2 text-lg my-auto ml-2">
                            <div className="text-neutral-600">
                                <span id={(player.round.get("decision") === "1box") ? "one-boxer" : (player.round.get("decision") === "2box") ? "two-boxer" : ""} className="font-semibold">{(!player.round.get("decision")) ? "Miss" : (player.round.get("decision") === "1box") ? "Open Box B only" : "Open Box A and Box B"}</span>
                            </div>
                            <div className="text-neutral-600">
                                <span className="font-light">Earning: </span><span className="font-semibold">${player.round.get("playerScore")}</span>
                            </div>
                            {treatment.isHypothetical &&
                                <div className="text-xs font-light text-neutral-500">Hypothetical: not actually paid</div>
                            }
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <AnimateIcon animate animation='default-loop' loop={false} className="relative text-transparent" size={32} >
                        <Unplug />
                    </AnimateIcon>
                </div>
                <div className="w-64">
                    <div className="flex h-full items-start bg-white p-3 rounded-xl shadow border-1 border-neutral-200">
                        <div className="flex flex-col items-center">
                            <img src={`/fig/Newcomb/Newcomb-result-${playerDecision}-${drawnLabel}.png`} className="mx-auto" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    return resultUI;
}