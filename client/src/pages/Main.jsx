import React, { useRef, useEffect, useState } from "react";
import {
    Panel,
    PanelGroup,
    PanelResizeHandle,
} from "react-resizable-panels";
import {
    useGame,
    useStage,
    usePlayer
} from "@empirica/core/player/classic/react";

import { AIPrediction } from "./newcomb/AIPrediction.jsx";
import { WheelPrediction } from "./newcomb/WheelPrediction.jsx";
import { HeaderUI } from "./newcomb/HeaderUI.jsx";
import { Overview } from "./overview/Overview.jsx";
import { OperationButton } from "./newcomb/OperationButton.jsx";
import { ResultUI } from "./newcomb/ResultUI.jsx";
import { BeliefSlider } from "./newcomb/BeliefSlider.jsx";

import { FloatingRobotAvatar } from "../avatar/FloatingRobotAvatar.jsx";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export function Main() {
    const game = useGame();
    const treatment = game.get("treatment");
    const player = usePlayer();
    const stage = useStage();
    const stageName = stage.get("name");
    const pdStep = player.round.get("pdStep") || "instruction"; // "instruction"; "message"; "decision"; "finished"
    const [collapsed, setCollapsed] = useState(false);

    const dotLottieRef = useRef(null);

    useEffect(() => {
        dotLottieRef.current?.pause();
    }, []);
    useEffect(() => {
        if (pdStep === "message") {
            dotLottieRef.current?.play();
        } else {
            dotLottieRef.current?.pause();
        }
    }, [pdStep]);

    const ui = (
        <div className="flex items-start max-h-250 justify-center h-full w-full p-8">
            <div className="flex flex-col w-2xl min-w-2xl h-full overflow-hidden shadow-xl bg-white">
                <div className="relative h-60 w-full p-4 border-b font-bold flex">
                    <div className="absolute w-300px">
                        {(treatment.isAI) ?
                            <FloatingRobotAvatar />
                            :
                            <DotLottieReact
                                src="/json/lottery.json"
                                loop
                                dotLottieRefCallback={(dotLottie) => {
                                    dotLottieRef.current = dotLottie;
                                }}
                                className="w-90 my-4"
                            />
                        }
                    </div>
                    <div className="relative w-[calc(100%-300px)] flex flex-col justify-between ml-auto">
                        <div className="h-50">
                            <HeaderUI />
                        </div>
                    </div>
                </div>
                {(stageName === "choice" || stageName === "result") &&
                    <div className="flex flex-col items-center justify-center h-full w-full px-4 gap-4 overflow-auto">
                        {(treatment.allocatorType === 'generativeAI') ? <AIPrediction /> : <WheelPrediction />}
                        <ResultUI />
                    </div>
                }
                {(stageName === "belief") &&
                    <div className="flex flex-col items-center justify-start h-full w-full px-4 gap-4 overflow-auto">
                        <BeliefSlider />
                    </div>
                }
                <div className="flex-1"></div>
                <div className="flex items-center h-32 w-full p-4 border-t bg-gray-50 gap-2 mt-auto">
                    <OperationButton />
                </div>
            </div>
        </div>
    )

    return (
        <PanelGroup direction="horizontal">
            <Panel
                defaultSize={15}
                minSize={collapsed ? 3 : 15}
                maxSize={collapsed ? 3 : 15}
            >
                <div className="h-full flex items-center justify-center relative bg-gray-50 border-r-3 border-gray-200">
                    {collapsed ? (
                        <div className="flex flex-col">
                            <button
                                onClick={() => setCollapsed(false)}
                                className="bg-white shadow px-2 py-1 rounded hover:bg-gray-200 transition text-sm"
                                title="展開"
                            >
                                ▶
                            </button>
                            <span className="text-xs mt-2 text-gray-500"></span>
                        </div>
                    ) : (
                        <div className="w-full h-full overflow-auto">
                            <div className="absolute top-2 right-2">
                                <button
                                    onClick={() => setCollapsed(true)}
                                    className="bg-white shadow px-2 py-1 rounded hover:bg-gray-200 transition text-sm"
                                    title="折りたたみ"
                                >
                                    ◀
                                </button>
                            </div>
                            <Overview />
                        </div>
                    )}
                </div>
            </Panel>
            {!collapsed && (
                <PanelResizeHandle className="w-[3px] bg-gray-200 cursor-col-resize" />
            )}
            <Panel defaultSize={collapsed ? 95 : 85}>
                <div className="w-full h-full overflow-auto">
                    {ui}
                </div>
            </Panel>
        </PanelGroup>
    )
}