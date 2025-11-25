import React from "react";
import {
    useGame,
    useStage,
    useRound,
    usePlayer,
    usePlayers
} from "@empirica/core/player/classic/react";
import {
    CircleCheckBigIcon,
    WorkflowIcon,
    MessagesSquareIcon,
    PointerIcon
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function ConnectionMonitor() {
    const game = useGame();
    const treatment = game.get("treatment");
    const stage = useStage();
    const round = useRound();
    const currentStageName = stage?.get('name');
    const currentRoundName = round?.get('name');
    const player = usePlayer();
    const players = usePlayers();

    const playerAvatar = player.get("avatar");

    const pdStepPlayer = player?.round?.get("pdStep") || "instruction";
    let statusPlayerText;
    let statusPlayerIcon;
    switch (pdStepPlayer) {
        case "instruction":
            statusPlayerText = "";
            statusPlayerIcon = null;
            break;
        case "message":
            statusPlayerText = `${(treatment.predictorType === "AI") ? "Getting AI suggestion" : "Spinning the wheel"}`;
            statusPlayerIcon = (
                <MessagesSquareIcon className="text-blue-400" size={18} />
            );
            break;
        case "decision":
            statusPlayerText = "Making a decision";
            statusPlayerIcon = (
                <PointerIcon className="text-blue-400" size={18} />
            );
            break;
        case "finished":
            statusPlayerText = "Making a decision";
            statusPlayerIcon = (
                <PointerIcon className="text-blue-400" size={18} />
            );
            break;
        default:
            statusPlayerText = "Waiting";
            statusPlayerIcon = (
                <CircleCheckBigIcon className="text-blue-400" size={18} />
            );
    }

    const partners = players?.filter((p) => p.id !== player.id);
    // 各partnerごとにstatusPartnerTextとstatusPartnerIconを計算
    const partnersStatus = partners?.map((partner) => {
        const pdStepPartner = partner?.round?.get("pdStep") || "instruction";
        let statusPartnerText;
        let statusPartnerIcon;
        switch (pdStepPartner) {
            case "instruction":
                statusPartnerText = "";
                statusPartnerIcon = null;
                break;
            case "message":
                statusPartnerText = `${(treatment.predictorType === "AI") ? "Getting AI suggestion" : "Spinning the wheel"}`;
                statusPartnerIcon = (
                    <MessagesSquareIcon className="text-blue-400" size={18} />
                );
                break;
            case "decision":
                statusPartnerText = "Making a decision";
                statusPartnerIcon = (
                    <PointerIcon className="text-blue-400" size={18} />
                );
                break;
            case "finished":
                statusPartnerText = "Making a decision";
                statusPartnerIcon = (
                    <PointerIcon className="text-blue-400" size={18} />
                );
                break;
            default:
                statusPartnerText = "Waiting";
                statusPartnerIcon = (
                    <CircleCheckBigIcon className="text-blue-400" size={18} />
                );
        }
        return {
            partner,
            statusPartnerText,
            statusPartnerIcon
        };
    });
    // console.log(currentRoundName);

    return (
        <div className="h-full w-180px mx-6">
            {(currentRoundName && currentRoundName !== "Matched") && (
                <div className="h-60">
                    <div className="h-18 w-40 items-end my-2">
                        <div className="flex h-full items-start justify-center bg-white p-3 rounded-xl shadow">
                            <div className="flex items-start justify-center mr-auto">
                                <div className="flex flex-col items-center justify-center">
                                    <Avatar className="mx-2 border-1 border-neutral-200">
                                        <AvatarImage src={`fig/icon/user/${playerAvatar}.svg`} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className="text-normal font-semibold text-neutral-800">You</div>
                                </div>
                                <div className="border-l-1 border-gray-200 h-10 ml-1 mr-1 my-auto"></div>
                                <div className="flex items-start justify-center gap-1 my-auto">
                                    <div className="animate-pulse">{(currentStageName === "choice") ? statusPlayerIcon : null}</div>
                                    <div className="bg-transparent hover:bg-transparent text-blue-400 mt-auto text-xs">{(currentStageName === "choice") ? statusPlayerText : null}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex text-center my-4 mx-2">
                        <WorkflowIcon className="mx-2" size={38} color="#00cc00" />
                        <Badge className="bg-transparent hover:bg-transparent border border-2 border-[#00cc00] text-[#00cc00] mt-auto">Connected</Badge>
                    </div>
                    {partnersStatus?.map(({ partner, statusPartnerText, statusPartnerIcon }, idx) => (
                        <div key={partner.id || idx} className="h-16 w-40 items-end my-2">
                            <div className="flex h-full items-start justify-center bg-white p-3 rounded-xl shadow">
                                <div className="flex items-start justify-center mr-auto">
                                    <div className="flex flex-col items-center justify-center">
                                        <Avatar className="mx-2 border-1 border-neutral-200">
                                            <AvatarImage src={`fig/icon/user/player${idx + 1}.svg`} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div className="text-sm font-semibold text-neutral-800"></div>
                                    </div>
                                    <div className="border-l-1 border-gray-200 h-10 ml-1 mr-1 my-auto"></div>
                                    <div className="flex items-start justify-center gap-1 my-auto">
                                        <div className="animate-pulse">{(currentStageName === "choice") ? statusPartnerIcon : null}</div>
                                        <div className="bg-transparent hover:bg-transparent text-blue-400 mt-auto text-xs">{(currentStageName === "choice") ? statusPartnerText : null}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}