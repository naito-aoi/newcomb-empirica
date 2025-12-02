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

import { DecisionButton } from "./DecisionButton.jsx";
import { TextComponents } from './ColoredText.tsx';
const customComponents = {
    ...TextComponents,
};

export function WheelPrediction() {
    const game = useGame();
    const treatment = game.get("treatment");
    const player = usePlayer();
    const stage = useStage();
    const playerAvatar = player.get("avatar");
    const pdStep = player.round.get("pdStep") || "instruction"; // "instruction"; "message"; "decision"; "finished"

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
    useEffect(() => {
        if (messageStream.length === 1) {
            const timer = setTimeout(() => {
                setShowSecondMessage(true);
            }, 5000);
            return () => clearTimeout(timer);
        } else {
            setShowSecondMessage(false);
        }
    }, [messageStream.length]);

    useEffect(() => {
        if (messageStream.length === 1) {
            player.round.set("pdStep", "decision");
        }
    }, [messageStream.length]);

    return (
        <>
            {(pdStep === 'instruction') ? (
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

                            // 5秒待機
                            await new Promise((resolve) => setTimeout(resolve, 5000));

                            const currentHistory = Array.isArray(player.round.get("chatHistory-suggestion")) ? player.round.get("chatHistory-suggestion") : [];
                            player.round.set("chatHistory-suggestion", [
                                ...currentHistory,
                                { role: "assistant", content: `${(treatment.isAI) ? "The AI has predicted your choice and fixed the contents in Box B!" : "The wheel has indicated your choice and fixed the contents in Box B!"}` }
                            ]);
                        }}
                    >
                        {(treatment.isAI) ? "Start prediction" : "Spin the wheel"}
                    </Button>
                </div>
            ) : (
                <></>
            )}
            <Conversation id="ai-conversation" className="w-full h-50 mb-auto" style={{ height: '500px' }}>
                <ConversationContent>
                    {(pdStep === "instruction") ? (
                        <ConversationEmptyState
                            title="No result yet."
                            description={`Please click "${(treatment.isAI) ? "Start prediction" : "Spin the wheel"}" button above.`}
                        />
                    ) : (
                        messageStream.map((message, index) => (
                            <Message from={message.role} key={index}>
                                <MessageContent>
                                    <Response components={customComponents}>{message.content}</Response>
                                </MessageContent>
                                <MessageAvatar src={`${(treatment.isAI) ? `/fig/icon/assistant/assistant-icon.svg` : `/fig/icon/assistant/wheel-icon.svg`}`} />
                            </Message>
                        ))
                    )}
                    {(pdStep === "message") && (
                        <>
                            <div className="flex items-center mx-1 gap-2">
                                {showSecondMessage ? <CircleCheckBigIcon className="w-4 h-4 text-neutral-400" /> : <Loader size={16} className="text-neutral-400" />}
                                <span className={`text-sm text-neutral-400 font-light ${showSecondMessage ? "animate-pulse" : ""}`}>{(treatment.isAI) ? "AI is predicting your choice..." : "Spinning the random picker wheel..."}</span>
                            </div>
                        </>
                    )}
                </ConversationContent>
                <ConversationScrollButton />
            </Conversation>
            <DecisionButton />
        </>
    )
}