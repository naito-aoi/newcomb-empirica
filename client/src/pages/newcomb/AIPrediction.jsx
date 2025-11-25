import React, { useEffect, useState } from "react";
import {
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

import { StreamingChat } from "./StreamingChat.jsx";
import { DecisionButton } from "./DecisionButton.jsx";

import { TextComponents } from './ColoredText.tsx';
const customComponents = {
    ...TextComponents,
};

export function AIPrediction() {
    const player = usePlayer();
    const stage = useStage();
    const playerAvatar = player.get("avatar");
    const pdStep = player.round.get("pdStep") || "instruction"; // "instruction"; "message"; "decision"; "finished"

    if (stage.get("name") === "result") {
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
        if (pdStep === "message") {
            const timer = setTimeout(() => {
                setShowSecondMessage(true);
            }, 2000);
            return () => clearTimeout(timer);
        } else {
            setShowSecondMessage(false);
        }
    }, [pdStep]);

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
                        className="relative h-10 w-50 bg-green-500 hover:bg-green-700 transition duration-150 shadow-lg text-lg rounded-lg"
                        onClick={() => {
                            player.round.set("pdStep", "message");
                            StreamingChat(player, stage, 'system', 'Please repeat the following message: "I have finished predicting your choice and fixed the contents in Box B!"', setStreamingAssistantContent)
                        }}
                    >
                        Start AI prediction
                    </Button>
                </div>
            ) : (
            <></>
            )}
            <Conversation id="ai-conversation" className="w-full h-30 mb-auto">
                <ConversationContent>
                    {(pdStep === "instruction") ? (
                        <ConversationEmptyState
                            title="No prediction yet."
                            description={`Please click the "Start AI prediction" button above.`}
                        />
                        ) : (
                        messageStream.map((message, index) => (
                            <Message from={message.role} key={index}>
                                <MessageContent>
                                    <Response components={customComponents}>{message.content}</Response>
                                </MessageContent>
                                <MessageAvatar src={(message.role==="assistant") ? `/fig/icon/assistant/${message.role}-icon.svg` : `/fig/icon/user/${playerAvatar}.svg`} />
                            </Message>
                        ))
                    )}
                    {(pdStep === "message") && (
                        <>
                            <div className="flex items-center mx-1 gap-2">
                                {showSecondMessage ? <CircleCheckBigIcon className="w-4 h-4 text-neutral-400" /> : <Loader size={16} className="text-neutral-400" />}
                                <span className={`text-sm text-neutral-400 font-light ${showSecondMessage ? "animate-pulse" : ""}`}>Predicting your choice...</span>
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