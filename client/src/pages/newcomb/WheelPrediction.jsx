import React, { useEffect, useState } from "react";
import {
    useGame,
    useStage,
    usePlayer
} from "@empirica/core/player/classic/react";
import {
    Conversation,
    ConversationContent,
    ConversationEmptyState,
    ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
    Message,
    MessageContent,
    MessageAvatar,
} from '@/components/ai-elements/message';
import { Response } from '@/components/ai-elements/response';
import { Loader } from '@/components/ai-elements/loader';
import { CircleCheckBigIcon } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";

import { getPredictor } from "@/utils/predictor.js";
import { DecisionButton } from "./DecisionButton.jsx";
import { TextComponents } from './ColoredText.tsx';
const customComponents = {
    ...TextComponents,
};

export function WheelPrediction() {
    const game = useGame();
    const treatment = game.get("treatment");
    const p = getPredictor(treatment);
    const player = usePlayer();
    const stage = useStage();
    const playerAvatar = player.get("avatar");
    const pdStep = player.round.get("pdStep") || "instruction"; // "instruction"; "message"; "decision"; "finished"
    const loadDuration = p.isPredictor ? 5000 : 3000;
    const loadDurationSecond = p.isPredictor ? 3000 : 1500;

    if (stage.get("name") !== "choice") {
        return null;
    }

    const [streamingAssistantContent, setStreamingAssistantContent] = useState("");
    const [showSecondMessage, setShowSecondMessage] = useState(false);
    const playerChatHistory = player.round.get("chatHistory-suggestion") || [];
    const messages = Array.isArray(playerChatHistory) ? playerChatHistory : [];
    const messageStream = [
        ...messages.filter(message => message.role !== "system"),
        ...(streamingAssistantContent
            ? [{ role: "assistant", content: streamingAssistantContent }]
            : [])
    ];

    // 2秒後に2番目のメッセージを表示
    const [predictionStarted, setPredictionStarted] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSecondMessage(true);
        }, loadDurationSecond);
        return () => clearTimeout(timer);
    }, [predictionStarted]);

    // exp4 "No prediction": nothing to start, so go straight to the decision.
    useEffect(() => {
        if (p.isNone && pdStep === "instruction" && messages.length === 0) {
            player.round.set("chatHistory-suggestion", [
                { role: "assistant", content: "The contents of Box B have already been determined." }
            ]);
        }
    }, []);

    useEffect(() => {
        if (messageStream.length === 1) {
            player.round.set("pdStep", "decision");
        }
    }, [messageStream.length]);

    return (
        <>
            {(pdStep === 'instruction' && !p.isNone) ? (
                <div className="relative flex items-center justify-center mt-4 gap-2">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-8 w-30 rounded-md bg-green-500 animate-ping"></div>
                    </div>
                    <Button
                        size="icon"
                        className="relative h-10 w-50 bg-green-500 hover:bg-green-700 transition duration-150 shadow-lg text-lg text-white rounded-lg"
                        onClick={async () => {
                            // 表示を先に message にしてロード状態にする
                            player.round.set("pdStep", "message");
                            // console.log("drawnLabel-before", player.round.get("drawnLabel"));
                            // draw
                            player.set('drawLabel', true);
                            setPredictionStarted(true);

                            // 5秒待機
                            await new Promise((resolve) => setTimeout(resolve, loadDuration));
                            // console.log("drawnLabel-after", player.round.get("drawnLabel"));

                            const currentHistory = Array.isArray(player.round.get("chatHistory-suggestion")) ? player.round.get("chatHistory-suggestion") : [];
                            player.round.set("chatHistory-suggestion", [
                                ...currentHistory,
                                { role: "assistant", content: `${(p.isPredictor) ? (treatment.predictorType ? `In this hypothetical situation, ${p.the} has already predicted your choice, and the contents of Box B have been fixed according to that prediction.` : `${p.The} has predicted your choice and fixed the contents in Box B!`) : "The random generator has drawn a label and fixed the contents in Box B!"}` }
                            ]);
                        }}
                    >
                        {(p.isPredictor) ? "Start prediction" : "Draw a label"}
                    </Button>
                </div>
            ) : (
                <></>
            )}
            <Conversation id="ai-conversation" className="w-full h-50 mb-auto px-4" style={{ height: '500px' }}>
                <ConversationContent>
                    {(pdStep === "instruction" && !p.isNone) ? (
                        <ConversationEmptyState
                            title="No result yet."
                            description={`Please click "${(p.isPredictor) ? "Start prediction" : "Draw a label"}" button above.`}
                        />
                    ) : (
                        messageStream.map((message, index) => (
                            <Message from={message.role} key={index}>
                                <MessageContent>
                                    <Response components={customComponents}>{message.content}</Response>
                                </MessageContent>
                                {/* <MessageAvatar src={`${(treatment.isAI) ? `/fig/icon/assistant/assistant-icon.svg` : `/fig/icon/assistant/wheel-icon.svg`}`} /> */}
                            </Message>
                        ))
                    )}
                    {(pdStep === "message") && (
                        <>
                            <div className="flex items-center mx-1 gap-2">
                                {showSecondMessage ? <CircleCheckBigIcon className="w-4 h-4 text-neutral-400" /> : <Loader size={16} className="text-neutral-400" />}
                                <span className={`text-sm text-neutral-400 font-light ${showSecondMessage ? "animate-pulse" : ""}`}>{(p.isPredictor) ? `${p.type === "AI" ? "AI" : p.The} is predicting your choice...` : "The random generator is drawing a label..."}</span>
                            </div>
                            {showSecondMessage && (
                                <div className="flex mx-1 gap-2 mt-2">
                                    <Loader size={16} />
                                    <span className="text-sm text-neutral-400 font-light animate-pulse">Setting the contents of Box B...</span>
                                </div>
                            )}
                        </>
                    )}
                </ConversationContent>
                <ConversationScrollButton />
            </Conversation>
            <DecisionButton />
        </>
    )
}