import React, { useState, useCallback, useRef, useEffect } from "react";
import {
    useGame,
    usePlayer,
    useStage
} from "@empirica/core/player/classic/react";

import { Textarea } from "@/components/ui/textarea"
// import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/animate-ui/components/buttons/button';
import {
    Progress,
    ProgressLabel,
    ProgressTrack,
    ProgressValue,
} from '@/components/animate-ui/components/base/progress';
import { SendIcon, CircleCheckBigIcon, MessageSquare } from "lucide-react"

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

import { ConnectionMonitor } from "./ConnectionMonitor.jsx";
import { StreamingChat } from "./StreamingChat.jsx";
import { FloatingRobotAvatar } from "../../avatar/FloatingRobotAvatar.jsx";

// Ref: https://shadcn-chatbot-kit.vercel.app/

export function AIInteraction() {
    const game = useGame();
    const treatment = game.get("treatment");
    const player = usePlayer();
    const stage = useStage();
    const playerAvatar = player.get("avatar") || 1;
    const introStep = player.get("introStep");

    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState("");
    const [streamingAssistantContent, setStreamingAssistantContent] = useState("");
    const [conversationOver, setConversationOver] = useState(false);

    // const [conversationStep, setConversationStep] = useState('tutorial'); // tutorial; conversation; finished
    const conversationStep = player.get("conversationStep") || 'tutorial'; // tutorial; conversation; finished
    // console.log("conversationStep", conversationStep);

    const playerChatHistory = player.get("chatHistory-conversation");
    const messages = Array.isArray(playerChatHistory) ? playerChatHistory : [];
    const messageStream = [
        ...messages.filter(message => message.role !== "system"),
        ...(streamingAssistantContent
            ? [{ role: "assistant", content: streamingAssistantContent }]
            : [])
    ];

    // 進捗バー用の状態
    const [progress, setProgress] = useState(0);
    const [progressIncrements, setProgressIncrements] = useState([]);
    const [completedTurns, setCompletedTurns] = useState(0);
    const maxProgress = 100;
    const maxTurns = 8;

    // 8回の会話ターンで100%になるよう、ランダムな進捗を事前に生成
    useEffect(() => {
        if (progressIncrements.length === 0) {
            // 8回のターンで合計100になるランダムな値を生成
            const increments = [];
            let remaining = 100;

            for (let i = 0; i < maxTurns - 1; i++) {
                const slotsLeft = maxTurns - i; // 残りスロット数（現在含む）
                // 基本の平均値を算出してから上下の幅を決める
                const avg = Math.floor(remaining / slotsLeft);
                const minIncrement = Math.max(5, Math.floor(avg * 0.5));
                // max は必ず min 以上にする（clamp してから max を min と比較）
                const tentativeMax = Math.floor(avg * 1.5);
                const maxIncrement = Math.max(minIncrement, Math.min(30, tentativeMax));

                const range = maxIncrement - minIncrement;
                const increment = range > 0
                    ? Math.floor(Math.random() * (range + 1)) + minIncrement
                    : minIncrement;

                increments.push(increment);
                remaining -= increment;
            }

            // 最後のターンで残りを全て追加（負になることを防ぐ）
            increments.push(Math.max(0, remaining));

            // 合計が 100 になるように最終要素を調整（丸めでずれる可能性を補正）
            const sum = increments.reduce((s, v) => s + v, 0);
            if (sum !== 100) {
                const diff = 100 - sum;
                increments[increments.length - 1] = Math.max(0, increments[increments.length - 1] + diff);
            }

            setProgressIncrements(increments);
        }
    }, []);

    // 会話ターンが完了したとき（assistant の応答が完了したとき）に進捗を更新
    useEffect(() => {
        const assistantMessages = messages.filter(msg => msg.role === "assistant");
        const newCompletedTurns = Math.min(assistantMessages.length, maxTurns);

        if (newCompletedTurns !== completedTurns && progressIncrements.length > 0) {
            setCompletedTurns(newCompletedTurns);

            if (newCompletedTurns === 0) {
                setProgress(0);
                return;
            }

            // 完了したターンまでの進捗を累積
            const newProgress = progressIncrements.slice(0, newCompletedTurns).reduce((sum, increment) => sum + increment, 0);
            setProgress(Math.min(newProgress, maxProgress));
        }
    }, [messages, progressIncrements, completedTurns]);

    // 会話の8ターン目が終わったら、完了メッセージを表示
    useEffect(() => {
        if (conversationOver) return;
        // console.log("completedTurns", completedTurns);
        if (completedTurns === 8) {
            setConversationOver(true);
            // setConversationStep('finished');
            player.set("conversationStep", 'finished');
            player.set("AIConversationFinished", true);
        } else if (completedTurns === 7) {
            const currentHistory = Array.isArray(player.get("chatHistory-conversation")) ? player.get("chatHistory-conversation") : [];
            player.set("chatHistory-conversation", [
                ...currentHistory,
                { role: "system", content: `Tell the user that the icebreaker is completed and the user can now proceed to the main task.` }
            ]);
        }
    }, [completedTurns]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = useCallback(() => {
        if (input.trim() === '' || isLoading) {
            return;
        }
        handleStreamingChat(input);
    }, [input, isLoading]);


    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };

    const handleStreamingChat = (currentInput) => {
        // progress barがmaxProgressになったら送信しない
        if (progress >= maxProgress) return;

        setIsLoading(true);
        setStreamingAssistantContent("");
        setInput("");

        StreamingChat(player, stage, 'user', currentInput, setStreamingAssistantContent).then(() => {
            setIsLoading(false);
            setStreamingAssistantContent("");
        });
    };

    return (
        <>
            <div className="flex flex-col w-2xl min-w-2xl h-full overflow-hidden shadow-xl bg-white">
                <div className="h-60 w-full p-4 border-b font-bold flex">
                    <FloatingRobotAvatar />
                    <div className="w-[calc(100%-300px)] flex flex-col justify-between">
                        <div className="h-40">
                            <div className="text-xl">{introStep}</div>
                            <div className="bg-white mt-4">
                                <div className="text-sm font-light">
                                    Now, Let's start the conversation with <span className="font-semibold text-blue-500">the AI</span>!
                                </div>
                                <div className="mt-2 text-sm font-light">
                                    <span className="font-semibold text-blue-500">The AI</span> will determine the contents of Box B based on its prediction about your future choice.
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            {(conversationStep === 'tutorial') ? (
                                <div className="relative flex items-center justify-center gap-2">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-8 w-30 rounded-md bg-sky-500 animate-ping"></div>
                                    </div>
                                    <Button
                                        size="icon"
                                        className="relative h-10 w-50 bg-sky-500 hover:bg-sky-600 text-white"
                                        onClick={() => {
                                            // setConversationStep('conversation');
                                            player.set("conversationStep", 'conversation');
                                            handleStreamingChat("Hello! Let's start our chat.");
                                        }}
                                    >
                                        Start Conversation
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-end gap-2 mt-1">
                                        <Progress value={progress} className="w-[300px] space-y-2 mb-1">
                                            <div className="flex items-center justify-between gap-1">
                                                <ProgressLabel className="text-neutral-500">Progress</ProgressLabel>
                                                <span className="text-sm text-neutral-500">
                                                    <ProgressValue /> %
                                                </span>
                                            </div>
                                            <ProgressTrack className={`${(conversationStep === 'finished') ? '[&>div]:bg-green-500' : '[&>div]:bg-cyan-400'}`} />
                                        </Progress>
                                        {conversationStep === 'finished' && (
                                            <CircleCheckBigIcon strokeWidth={3} className="h-4 w-4 text-green-500" />
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <Conversation id="ai-conversation" className="relative w-full" style={{ height: '500px' }}>
                    <ConversationContent>
                        {messageStream.length === 0 ? (
                            <ConversationEmptyState
                                title="Please click the button to start conversation"
                                description="A conversation will appear here"
                            />
                        ) : (
                            messageStream.map((message, index) => (
                                <Message from={message.role} key={index} className="w-[90%] mx-auto">
                                    <MessageContent>
                                        <Response>{message.content}</Response>
                                    </MessageContent>
                                    {/* <MessageAvatar src={`/fig/icon/assistant/${message.role}-icon.svg`} /> */}
                                </Message>
                            ))
                        )}
                    </ConversationContent>
                    <ConversationScrollButton />
                </Conversation>
                <div className="flex items-center min-h-22 w-full p-4 border-t bg-gray-50 gap-2">
                    {(conversationStep === 'conversation') && (
                        <>
                            <Textarea
                                placeholder={isLoading ? "AI is responding..." : "Type your message here"}
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                                className="min-h-[50px] bg-white resize-none shadow-inner focus:outline-none focus:ring-0"
                            />
                            <Button
                                size="icon"
                                onClick={handleSubmit}
                                disabled={input.trim() === '' || isLoading}
                                className="h-12 w-12 bg-blue-600 hover:bg-blue-700 transition duration-150 shadow-lg rounded-full"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <SendIcon className="h-6 w-6" />
                                )}
                            </Button>
                        </>
                    )}
                    {/* {progress >= maxProgress && ( */}
                    {(player.get("AIConversationFinished")) && (
                        <div className="relative flex items-center justify-center gap-2 w-full">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-10 w-32 rounded-md bg-green-500 animate-ping"></div>
                            </div>
                            <Button
                                size="icon"
                                className="relative h-12 w-50 bg-green-500 hover:bg-green-700 transition duration-150 shadow-lg text-lg rounded-lg mx-auto"
                                onClick={() => {
                                    player.set("introStep", "Decision making task");
                                    player.set('introStepIndex', 2);
                                    player.set('introDone', true);
                                }}
                            >
                                Start the Task
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <ConnectionMonitor />
        </>
    )
}