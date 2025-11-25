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
import { ConnectionMonitor } from "../tasks/ConnectionMonitor.jsx";

export function ExpectationSurvey() {
    const game = useGame();
    const treatment = game.get("treatment");
    const player = usePlayer();
    const introStep = player.get("introStep");
    const expectationSurveyAnswered = player.get("expectation-survey");

    // const [conversationStep, setConversationStep] = useState('tutorial'); // tutorial; conversation; finished
    const conversationStep = player.get("conversationStep") || 'tutorial'; // tutorial; conversation; finished
    // console.log("conversationStep", conversationStep);

    const [answers, setAnswers] = useState({});

    let questions = [
        {
            id: 1,
            text: "The system’s outputs will be based on accurate predictions of my choices.",
            scale: [
                "Strongly disagree",
                "",
                "",
                "Neutral",
                "",
                "",
                "Strongly agree"
            ]
        }, {
            id: 2,
            text: "The system will be good at anticipating what I will do in this task.",
            scale: [
                "Strongly disagree",
                "",
                "",
                "Neutral",
                "",
                "",
                "Strongly agree"
            ]
        }, {
            id: 3,
            text: "I doubt that the system has any meaningful predictive basis.",
            scale: [
                "Strongly disagree",
                "",
                "",
                "Neutral",
                "",
                "",
                "Strongly agree"
            ]
        }
    ];

    // treatmemt.gameType !== "Newcomb"の場合に、質問を追加
    if (treatment.gameType !== "Newcomb") {
        questions.push({
            id: 4,
            text: "Other participants will follow the system’s suggestions.",
            scale: [
                "Strongly disagree",
                "",
                "",
                "Neutral",
                "",
                "",
                "Strongly agree"
            ]
        });
    }


    // 全質問が回答されたらAIConversationFinishedをtrueにする
    useEffect(() => {
        const allAnswered = questions.every(q => answers[q.id] && answers[q.id] !== "");
        if (allAnswered && !player.get('expectationSurveyFinished')) {
            player.set('expectationSurveyFinished', true);
        }
    }, [answers, player]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value,
        }));
        player.set(`expectation-q${questionId}`, value);
    };

    return (
        <>
            <div className="flex flex-col w-2xl min-w-2xl h-full overflow-hidden shadow-xl bg-white">
                <div className="h-60 w-full p-4 border-b font-bold flex">
                    <div className="w-300px">
                        <img src="/fig/misc/survey.svg" alt="Survey" className="h-48 w-48 mx-auto" />
                    </div>
                    <div className="w-[calc(100%-300px)] flex flex-col justify-between">
                        <div className="h-40">
                            <div className="text-xl">{introStep}</div>
                            <div className="bg-white mt-4">
                                <div className="text-sm font-light">
                                    Now, please tell us what you expect from the {(treatment.predictorType)} {(treatment.gameType === "Newcomb") ? "" : "messaging"} system.
                                    There are no right or wrong answers.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="ai-conversation" className="flex flex-col h-full overflow-y-auto py-4 px-12 gap-6 bg-sky-50">
                    {questions.map((question) => (
                        <Card key={question.id} className="w-full">
                            <CardHeader>
                                <CardTitle className="text-md font-medium text-neutral-700">{question.id}. {question.text}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={
                                        answers[question.id] ||
                                        player?.get(`expectation-q${question.id}`)
                                        // (expectationSurveyAnswered && expectationSurveyAnswered.find(q => q.id === question.id)?.choice)
                                    }
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
                    {(player.get("expectationSurveyFinished")) && (
                        <div className="relative flex items-center justify-center gap-2 w-full">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-10 w-32 rounded-md bg-green-500 animate-ping"></div>
                            </div>
                            <Button
                                size="icon"
                                className="relative h-12 w-50 bg-green-500 hover:bg-green-700 transition duration-150 shadow-lg text-lg rounded-lg mx-auto"
                                onClick={() => {
                                    if (treatment.predictorType === 'AI') {
                                        player.set('introStepIndex', 2);
                                        player.set("introStep", "Let's interact with AI!");
                                    } else {
                                        player.set('introStepIndex', 1);
                                        player.set("introStep", "Pre-task survey");
                                    }
                                }}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                    {/* <div className="absolute text-xs text-neutral-500 font-light mt-13 mb-0 text-center">
                        * Your answers here will not be used for screening.
                    </div> */}
                </div>
            </div>
            <ConnectionMonitor />
        </>
    )
}