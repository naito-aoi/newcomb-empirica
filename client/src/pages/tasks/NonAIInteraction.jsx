import React, { useState, useCallback, useRef, useEffect } from "react";
import {
    useGame,
    usePlayer
} from "@empirica/core/player/classic/react";
import { Button } from '@/components/animate-ui/components/buttons/button';

import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ConnectionMonitor } from "./ConnectionMonitor.jsx";
// Ref: https://shadcn-chatbot-kit.vercel.app/

export function NonAIInteraction() {
    const game = useGame();
    const treatment = game.get("treatment");
    const player = usePlayer();
    const introStep = player.get("introStep");
    const pretaskSurveyAnswered = player.get("pretask-survey");

    // const [conversationStep, setConversationStep] = useState('tutorial'); // tutorial; conversation; finished
    const conversationStep = player.get("conversationStep") || 'tutorial'; // tutorial; conversation; finished
    // console.log("conversationStep", conversationStep);

    const [answers, setAnswers] = useState({});

    const questions = [
        {
            id: 1,
            text: "When did you start participating in online studies?",
            scale: [
                "Less than 1 month ago",
                "",
                "",
                "1 year ago",
                "",
                "",
                "More than 3 years ago"
            ]
        }, {
            id: 2,
            text: "How frequently do you participate in online studies?",
            scale: [
                "Less than once a month",
                "",
                "",
                "Once a week",
                "",
                "",
                "Every day"
            ]
        }, {
            id: 3,
            text: "When participating in online study, what do you prioritize: monetary reward or enjoyment / satisfaction?",
            scale: [
                "Monetary reward",
                "",
                "",
                "Both equally",
                "",
                "",
                "Enjoyment / satisfaction"
            ]
        }, {
            id: 4,
            text: "Do you prefer tasks you complete alone or tasks you complete in a group?",
            scale: [
                "Alone",
                "",
                "",
                "Both equally",
                "",
                "",
                "In a group"
            ]
        }, {
            id: 5,
            text: "Do you prefer completing many short studies with low rewards or a few long studies with high rewards?",
            scale: [
                "Many short studies",
                "",
                "",
                "Both equally",
                "",
                "",
                "Few long studies"
            ]
        }, {
            id: 6,
            text: "Have you ever participated in a similar study that you exchange endowments with other participants?",
            scale: [
                "Never",
                "",
                "",
                "Five times",
                "",
                "",
                "More than ten times"
            ]
        },
    ];
    // 全質問が回答されたらAIConversationFinishedをtrueにする
    useEffect(() => {

        const allAnswered = questions.every(q => answers[q.id] && answers[q.id] !== "");
        if (allAnswered && !player.get('AIConversationFinished')) {
            player.set('AIConversationFinished', true);
        }
    }, [answers, player]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value,
        }));
        player.set("pretask-survey", [
            ...pretaskSurveyAnswered.filter(q => q.id !== questionId),
            { id: questionId, choice: value }
        ]);
    };

    return (
        <>
            <div className="flex flex-col w-2xl min-w-2xl h-full overflow-hidden shadow-xl bg-white">
                <div className="h-60 w-full p-4 border-b font-bold flex">
                    {/* <FloatingRobotAvatar /> */}

                    <div className="w-300px">
                        <img src="/fig/misc/survey.svg" alt="Survey" className="h-48 w-48 mx-auto" />
                    </div>
                    <div className="w-[calc(100%-300px)] flex flex-col justify-between">
                        <div className="h-40">
                            <div className="text-xl">{introStep}</div>
                            <div className="bg-white mt-4">
                                <div className="text-sm font-light">
                                    Now, please answer the following pre-task survey questions about your experience with online studies!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="ai-conversation" className="flex flex-col h-full overflow-y-auto py-4 px-12 gap-6 bg-sky-50">
                    {questions.map((question) => (
                        <Card key={question.id} className="w-full bg-white">
                            <CardHeader>
                                <CardTitle className="text-md font-medium text-neutral-700">{question.id}. {question.text}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={answers[question.id] || pretaskSurveyAnswered.find(q => q.id === question.id)?.choice}
                                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                                    className="flex flex-row w-[80%] mx-auto text-neutral-500"
                                >
                                    {[...Array(7)].map((_, idx) => (
                                        <div className="flex flex-col items-center justify-start flex-1" key={idx}>
                                            <RadioGroupItem value={`${idx + 1}`} id={`${question.id}-${idx + 1}`} required />
                                            <Label htmlFor={`${question.id}-${idx + 1}`} className="mt-1 text-xs text-center">
                                                {question.scale[idx]}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="relative flex flex-col items-center min-h-22 w-full p-4 border-t bg-gray-50 gap-2">
                    {(player.get("AIConversationFinished")) && (
                        <div className="relative flex items-center justify-center gap-2 w-full">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-10 w-32 rounded-md bg-green-500 animate-ping"></div>
                            </div>
                            <Button
                                size="icon"
                                className="relative h-12 w-50 text-white bg-green-500 hover:bg-green-700 transition duration-150 shadow-lg text-lg rounded-lg mx-auto"
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
                    <div className="absolute text-xs text-neutral-500 font-light mt-13 mb-0 text-center">
                        * Your answers here will not be used for screening.
                    </div>
                </div>
            </div>
            <ConnectionMonitor />
        </>
    )
}