import React, { useEffect } from "react";
import {
    useGame,
    usePlayer,
    useStage
} from "@empirica/core/player/classic/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Unplug } from '@/components/animate-ui/icons/unplug';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';

export function ResultUI() {
    const game = useGame();
    const treatment = game.get("treatment");
    const player = usePlayer();
    const playerAvatar = player.get("avatar");

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

    // console.log(player.round.get("playerScore"));

    const yourChoice = (treatment.gameType === "PGG") ?
        (player.round.get("decision") === "Give" ? "Contribute" : player.round.get("decision")) :
        player.round.get("decision");

    const currentRound = game.round.get("round");
    const cumulativeScore = player.get("playerScore") || 0;
    const averageScoreSoFar = parseFloat(cumulativeScore / currentRound).toFixed(2).replace(/\.?0+$/, '');

    const resultUI = (
        <>
            <div className="flex">
                <div className="w-64">
                    <div className="flex h-full items-start bg-white p-3 rounded-xl shadow border-1 border-neutral-200">
                        <div className="flex flex-col items-center">
                            <Avatar className="mx-2 border-1 border-neutral-200">
                                <AvatarImage src={`fig/icon/user/${playerAvatar}.svg`} />
                                <AvatarFallback></AvatarFallback>
                            </Avatar>
                            <div className="text-normal font-semibold text-neutral-800">You</div>
                        </div>
                        <div className="border-l-1 border-gray-200 h-30 ml-1 mr-3 my-auto"></div>
                        <div className="flex flex-col items-start justify-center h-full gap-2 text-md">
                            <div className="text-neutral-600">
                                Decision: <span id={(player.round.get("decision") === "Give" || player.round.get("decision") === "Contribute") ? "one-boxer" : (player.round.get("decision") === "Keep") ? "two-boxer" : ""} className="font-semibold">{(!player.round.get("decision")) ? "Miss" : yourChoice}</span>
                            </div>
                            <div className="text-neutral-600">
                                Earning: <span className="font-semibold">{player.round.get("playerScore")} pt</span>
                            </div>
                            <div className="text-neutral-600">
                                Average: <span className="font-semibold">{averageScoreSoFar} pt</span>
                            </div>
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
                        {treatment.gameType === "PGG" ? (
                            <>
                                <div className="flex flex-col items-center">
                                    <Avatar className="mx-2 border-1 border-neutral-200">
                                        <AvatarImage src="fig/icon/tutorial/group.svg" />
                                        <AvatarFallback></AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm font-semibold text-neutral-800">Group</div>
                                </div>
                                <div className="border-l-1 border-gray-200 h-30 ml-1 mr-3 my-auto"></div>
                                <div className="flex flex-col items-start justify-center h-full gap-2 text-md">
                                    <div className="text-neutral-600">
                                        Contribute: <span className="font-semibold">{player.round.get("nContributors")}</span> <span className="font-normal">/ {treatment.playerCount}</span>
                                    </div>
                                    <div className="text-neutral-600">
                                        Share: <span className="font-semibold">{player.round.get("distribution")} pt</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col items-center">
                                    <Avatar className="mx-2 border-1 border-neutral-200">
                                        <AvatarImage src="fig/icon/user/partner.svg" />
                                        <AvatarFallback></AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm font-semibold text-neutral-800">Partner</div>
                                </div>
                                <div className="border-l-1 border-gray-200 h-30 ml-1 mr-3 my-auto"></div>
                                <div className="flex flex-col items-start gap-2 text-lg mt-6 ml-4">
                                    <div className="text-neutral-600">
                                        Decision: <span id={(player.round.get("partnerDecision") === "Give") ? "one-boxer" : (player.round.get("partnerDecision") === "Keep") ? "two-boxer" : ""} className="font-semibold">{(!player.round.get("partnerDecision")) ? "Miss" : player.round.get("partnerDecision")}</span>
                                    </div>
                                    <div className="text-neutral-600">
                                        Earning: <span className="font-semibold">{player.round.get("partnerScore")} pt</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );

    return resultUI;
}