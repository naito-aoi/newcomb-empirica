import React, {
    useEffect,
    useState
} from "react";
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
import { DecisionButton } from "./DecisionButton.jsx";

import { TextComponents } from './ColoredText.tsx';
const customComponents = {
    ...TextComponents,
};

export function KanbanSuggestion() {
    const game = useGame();
    const treatment = game.get("treatment");
    const player = usePlayer();
    const stage = useStage();
    const pdStep = player.round.get("pdStep") || "instruction"; // "instruction"; "message"; "decision"; "finished"

    if (stage.get("name") === "result") {
        return null;
    }

    const suggestionText = (treatment.gameType === "PD") ?
        `Your partner is likely to choose <${(treatment.suggestionType === "Cooperation") ? "give" : "keep"}-text>${(treatment.suggestionType === "Cooperation") ? "Give" : "Keep"}</${(treatment.suggestionType === "Cooperation") ? "give" : "keep"}-text>... So, I suggest you choose <${(treatment.suggestionType === "Cooperation") ? "give" : "keep"}-text>${(treatment.suggestionType === "Cooperation") ? "Give" : "Keep"}</${(treatment.suggestionType === "Cooperation") ? "give" : "keep"}-text>!` :
        `Most participants are likely to choose <${(treatment.suggestionType === "Cooperation") ? "give" : "keep"}-text>${(treatment.suggestionType === "Cooperation") ? "Contribute" : "Keep"}</${(treatment.suggestionType === "Cooperation") ? "give" : "keep"}-text>... So, I suggest you choose <${(treatment.suggestionType === "Cooperation") ? "give" : "keep"}-text>${(treatment.suggestionType === "Cooperation") ? "Contribute" : "Keep"}</${(treatment.suggestionType === "Cooperation") ? "give" : "keep"}-text>!`;

    useEffect(() => {
        const currentHistory = Array.isArray(player.round.get("chatHistory-suggestion")) ? player.round.get("chatHistory-suggestion") : [];
        player.round.set("chatHistory-suggestion", [
            ...currentHistory,
            { role: "assistant", content: suggestionText }
        ]);
        player.round.set("pdStep", "decision");
    }, []);

    const [streamingAssistantContent, setStreamingAssistantContent] = useState("");
    const playerChatHistory = player.round.get("chatHistory-suggestion") || [];
    const messages = Array.isArray(playerChatHistory) ? playerChatHistory : [];
    const messageStream = [
        ...messages.filter(message => message.role !== "system"),
        ...(streamingAssistantContent
            ? [{ role: "assistant", content: streamingAssistantContent }]
            : [])
    ];

    return (
        <>
            <Conversation id="ai-conversation" className="w-full h-50 mb-auto" style={{ height: '500px' }}>
                <ConversationContent>
                    {pdStep === "instruction" ? (
                        <ConversationEmptyState
                            title="No suggestion yet for this round."
                            description={`Please click "Spin the wheel" button above.`}
                        />
                    ) : (
                        messageStream.length > 0 && (
                            <Message from={messageStream[messageStream.length - 1].role} key={messageStream.length - 1}>
                                <MessageContent>
                                    <Response components={customComponents}>{messageStream[messageStream.length - 1].content}</Response>
                                </MessageContent>
                            </Message>
                        )
                    )}
                </ConversationContent>
                <ConversationScrollButton />
            </Conversation>
            <DecisionButton />
        </>
    )
}