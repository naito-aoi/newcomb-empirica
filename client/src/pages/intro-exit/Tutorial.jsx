import React, { useState } from "react";
import { Survey } from "survey-react-ui";
import { Model } from 'survey-core';
import 'survey-core/defaultV2.min.css';
import { themeJson } from "../../styles/survey_theme.js";
import {
    useGame,
    usePlayer
} from "@empirica/core/player/classic/react";
import { getPredictor } from "@/utils/predictor.js";

export function Tutorial({ next }) {
    const game = useGame();
    const player = usePlayer();
    const treatment = game.get('treatment');
    const p = getPredictor(treatment);
    // exp4 treatments are the only ones that set the `predictorType` factor
    const isExp4 = !!treatment.predictorType;

    // exp4: the money in the boxes is hypothetical and never paid out.
    const payoffNote = (treatment.isHypothetical) ? `
                                    <p>
                                        <b>Please note that this task is hypothetical: the money in the boxes will NOT actually be paid.</b>
                                        Nevertheless, please make your choice as if the money were real.
                                    </p>
    ` : `You will receive the contents of the box(es) you open as a bonus.`;

    // exp4: `reliability` controls what is said about the predictor's accuracy.
    //   reliable -> high reliability is stated explicitly
    //   agnostic -> nothing at all is said about reliability
    //   (unset)  -> exp1-3 wording
    const twoOrOne = `whether you will choose <span id='two-boxer'>two boxes</span> or <span id='one-boxer'>one box</span>:`;
    const predictorIntro = (!p.isPredictor) ?
        `One of two labels below will be <b>randomly drawn</b> with equal probabilities:`
        : (treatment.reliability === "reliable") ?
            `<b><span id='ai-avatar'>${p.type === "AI" ? "The AI system" : "This person"}</span> has been trained to predict people's choices in this task and has correctly predicted 98 out of 100 previous participants' choices.</b> <span id='ai-avatar'>${p.The}</span> predicts ${twoOrOne}`
            : (treatment.reliability === "agnostic") ?
                `<span id='ai-avatar'>${p.The}</span> predicts ${twoOrOne}`
                : `<span id='ai-avatar'>The AI</span> is specifically designed for this task to predict</b> whether people will choose <span id='two-boxer'>two boxes</span> or <span id='one-boxer'>one box</span>:`;
    const runMode = player.get('runMode');

    const returnBonus = player.get('returnBonus');
    const newcombBoxAValue = player.get('newcombBoxAValue');
    const newcombBoxBValue = player.get('newcombBoxBValue');

    // const surveyJson = {
    //     "showProgressBar": "aboveHeader",
    //     "progressBarType": "pages",
    //     "progressBarShowPageNumbers": true,
    //     "progressBarShowPageTitles": false,
    //     "widthMode": "static",
    //     "width": 900,
    //     "pages": [
    //         {
    //             "name": "page1",
    //             "elements": [
    //                 {
    //                     "type": "panel",
    //                     "elements": [
    //                         {
    //                             "type": "html",
    //                             "html": `
    //                                 <h5>
    //                                     Tutorial
    //                                 </h5>
    //                                 <br> 
    //                                 <p>
    //                                     This study is being conducted by <b>the School of Computer Science at Carnegie Mellon University</b>.
    //                                     As you read through this tutorial, please answer the four comprehension questions that look like this:
    //                                 </p>
    //                             `
    //                         }, {
    //                             "type": "radiogroup",
    //                             "name": "exampleQuestion",
    //                             "title": "(Example) Do you need to answer comprehension questions about this tutorial?",
    //                             "isRequired": false,
    //                             "choices": [
    //                                 "Yes",
    //                                 "No"
    //                             ]
    //                         }, {
    //                             "type": "html",
    //                             "html": `
    //                                 <p>
    //                                     If you answer the questions incorrectly <b>twice</b>, you will be asked to return this study.
    //                                     We only use these questions to ensure you understand the study details.
    //                                 </p>
    //                             `
    //                         }
    //                     ],
    //                     "showQuestionNumbers": "off"
    //                 }
    //             ]
    //         }, {
    //             "name": "page2",
    //             "elements": [
    //                 {
    //                     "type": "panel",
    //                     "elements": [
    //                         {
    //                             "type": "html",
    //                             "name": "inst2aText",
    //                             "html": `
    //                                 <h5>
    //                                     Decision Making Task
    //                                 </h5>
    //                                 <p>
    //                                     In this study, <b>you are asked to make a choice between two options</b>. 
    //                                     Based on your choice, you will receive an extra bonus.
    //                                     Your final bonus will be between $0 and a maximum of $${newcombBoxAValue + newcombBoxBValue}.
    //                                 </p>
    //                             `
    //                         }, {
    //                             "type": "html",
    //                             "html": `
    //                                 <p>
    //                                     First, you are presented with <b>two boxes</b>:
    //                                 </p>
    //                                 <img src="/fig/Newcomb/newcomb-boxes.png" className="mx-auto mb-2" />
    //                                 <ol>
    //                                     <li>
    //                                         <b>Box A</b> (left) is transparent, and you can see the contents inside.
    //                                         $${newcombBoxAValue} is guaranteed in this box.
    //                                     </li>
    //                                     <li>
    //                                         <b>Box B</b> (right) is opaque, and you cannot see the contents inside.
    //                                         The contents are either $0 or $${newcombBoxBValue}.
    //                                     </li>
    //                                 </ol>
    //                             `
    //                         }
    //                     ],
    //                     "showQuestionNumbers": "off"
    //                 }
    //             ]
    //         }, {
    //             "name": "page3",
    //             "elements": [
    //                 {
    //                     "type": "panel",
    //                     "name": "panel3",
    //                     "elements": [
    //                         {
    //                             "type": "html",
    //                             "name": "inst3Text",
    //                             "html": `
    //                                 <h5>
    //                                     Open Two Boxes or One Box
    //                                 </h5>
    //                                 <p>
    //                                     Then, you will be asked to choose either option:
    //                                 </p>
    //                                 <ol>
    //                                     <li>
    //                                         Open <span id="two-boxer"><b>both Box A and Box B</b></span> (Two Boxes)
    //                                     </li>
    //                                     <li>
    //                                         Open <span id="one-boxer"><b>Box B only</b></span> (One Box)
    //                                     </li>
    //                                 </ol>
    //                             `
    //                         }, {
    //                             "type": "image",
    //                             "imageLink": "/fig/Newcomb/newcomb-options.png",
    //                             "imageHeight": 200,
    //                             "imageWidth": 800
    //                         }, {
    //                             "type": "html",
    //                             "name": "inst3Text",
    //                             "html": `
    //                                 <p>
    //                                     Note that your choice is <b>NOT</b> between opening Box A or Box B.
    //                                     Instead, you choose <b>whether to open two boxes or one box</b>.
    //                                 </p>
    //                             `
    //                         }
    //                     ],
    //                     "showQuestionNumbers": "off"
    //                 }, {
    //                     "type": "panel",
    //                     "name": "q1",
    //                     "elements": [
    //                         {
    //                             "type": "html",
    //                             "html": `
    //                                 <h5>Comprehension Question</h5>
    //                             `
    //                         }, {
    //                             "type": "radiogroup",
    //                             "name": "question1",
    //                             "title": "What are the task's options?",
    //                             "isRequired": true,
    //                             // "choicesOrder": "random",
    //                             "choices": [
    //                                 {
    //                                     "value": 0,
    //                                     "text": `Both boxes or Box B only` + `${(runMode === "dev" ? " [correct]" : "")}`
    //                                 }, {
    //                                     "value": 1,
    //                                     "text": "Box A or Box B"
    //                                 }, {
    //                                     "value": 2,
    //                                     "text": "Open or close the boxes"
    //                                 }
    //                             ],
    //                             "correctAnswer": 0
    //                         }
    //                     ],
    //                     "showQuestionNumbers": "off"
    //                 }
    //             ]
    //         }, {
    //             "name": "page4",
    //             "elements": [
    //                 {
    //                     "type": "panel",
    //                     "name": "panel4",
    //                     "elements": [
    //                         {
    //                             "type": "html",
    //                             "name": "inst4Text",
    //                             "html": `
    //                                 <h5>
    //                                     ${(treatment.isAI) ? "AI" : "Random Picker Wheel"} Decides the Contents of Box B
    //                                 </h5>
    //                                 <p>
    //                                     Here, we introduce <span id="ai-avatar">${(treatment.isAI) ? "an AI system" : "a random picker wheel"}</span> to decide the contents of Box B before you make a choice.
    //                                     ${(treatment.isAI) ? "<b><span id='ai-avatar'>The AI</span> is specifically designed for this task to predict</b> whether people will choose <span id='two-boxer'>two boxes</span> or <span id='one-boxer'>one box</span>, which then sets the content of Box B.</span>" : "The wheel has two types of indications as described below, and the contents of Box B will be set according to the indication <b>randomly drawn</b> with equal probability."}
    //                                 </p>
    //                                 <p>
    //                                     <b>If <span id="ai-avatar">${(treatment.isAI) ? "the AI predicts" : "the random picker wheel indicates"}</span> "you will choose <span id="two-boxer">two boxes (Boxes A and B)</span>", the contents of Box B are set to $0</b>.
    //                                 </p>  
    //                             `
    //                         }, {
    //                             "type": "image",
    //                             "imageLink": `/fig/Newcomb/newcomb-${(treatment.isAI) ? "ai" : "lottery"}-prediction-2box.png`,
    //                             "imageHeight": 200,
    //                             "imageWidth": 800
    //                         }, {
    //                             "type": "html",
    //                             "html": `
    //                                 <p>
    //                                     <b>If <span id="ai-avatar">${(treatment.isAI) ? "the AI predicts" : "the random picker wheel indicates"}</span> "you will choose <span id="one-boxer">one box (Box B)</span>", the contents of Box B are set to $${newcombBoxBValue}</b>.
    //                                 </p>
    //                             `
    //                         }, {
    //                             "type": "image",
    //                             "imageLink": `/fig/Newcomb/newcomb-${(treatment.isAI) ? "ai" : "lottery"}-prediction-1box.png`,
    //                             "imageHeight": 200,
    //                             "imageWidth": 800
    //                         }, {
    //                             "type": "html",
    //                             "html": `
    //                                 <p>
    //                                     Note that Box A contains $${newcombBoxAValue} regardless of the ${(treatment.isAI) ? "prediction" : "random picker wheel's result"}.
    //                                 </p>
    //                             `
    //                         }
    //                     ],
    //                     "showQuestionNumbers": "off"
    //                 }, {
    //                     "type": "panel",
    //                     "name": "q2",
    //                     "elements": [
    //                         {
    //                             "type": "html",
    //                             "html": `
    //                                 <h5>Comprehension Question</h5>
    //                             `
    //                         }, {
    //                             "type": "radiogroup",
    //                             "name": "question2",
    //                             "title": `How much money is in Box B if ${(treatment.isAI) ? "the AI predicts" : "the random picker wheel indicates"} you will open both boxes?`,
    //                             "isRequired": true,
    //                             // "choicesOrder": "random",
    //                             "choices": [
    //                                 {
    //                                     "value": 1,
    //                                     "text": `$${newcombBoxBValue}`
    //                                 }, {
    //                                     "value": 0,
    //                                     "text": `$0` + `${(runMode === "dev" ? " [correct]" : "")}`
    //                                 }, {
    //                                     "value": 2,
    //                                     "text": `$${newcombBoxAValue}`
    //                                 }
    //                             ],
    //                             "correctAnswer": 0
    //                         }
    //                     ],
    //                     "showQuestionNumbers": "off"
    //                 }
    //             ]
    //         }, {
    //             "name": "page5",
    //             "elements": [
    //                 {
    //                     "type": "panel",
    //                     "name": "panel5",
    //                     "elements": [
    //                         {
    //                             "type": "html",
    //                             "name": "inst5Text",
    //                             "html": `
    //                                 <h5>
    //                                     You Make Your Choice After ${(treatment.isAI) ? "AI's Prediction" : "Random Draw"}
    //                                 </h5>
    //                                 <p>
    //                                     Once <span id="ai-avatar">${(treatment.isAI) ? "the AI has predicted</span> your choice and" : "the random picker wheel</span> has"} determined the contents of Box B, you will choose whether to open <span id="two-boxer">two boxes</span> or <span id="one-boxer">one box</span>.
    //                                     You will not be informed of ${(treatment.isAI) ? "the AI's prediction" : "the random picker wheel's outcome"} in advance.
    //                                 </p>
    //                             `
    //                         }, {
    //                             "type": "image",
    //                             "imageLink": `/fig/Newcomb/newcomb-options-2.png`,
    //                             "imageHeight": 200,
    //                             "imageWidth": 800
    //                         },
    //                     ],
    //                     "showQuestionNumbers": "off"
    //                 }, {
    //                     "type": "panel",
    //                     "name": "q3",
    //                     "elements": [
    //                         {
    //                             "type": "html",
    //                             "html": `
    //                                 <h5>Comprehension Question</h5>
    //                             `
    //                         }, {
    //                             "type": "radiogroup",
    //                             "name": "question3",
    //                             "title": `When you choose one of the two options, has Box B's contents already been determined?`,
    //                             "isRequired": true,
    //                             "choicesOrder": "random",
    //                             "choices": [
    //                                 {
    //                                     "value": 0,
    //                                     "text": `Yes` + `${(runMode === "dev" ? " [correct]" : "")}`
    //                                 }, {
    //                                     "value": 1,
    //                                     "text": `No`
    //                                 }, {
    //                                     "value": 2,
    //                                     "text": `It depends on the ${(treatment.isAI) ? "AI's prediction" : "random picker wheel's outcome"}.`
    //                                 }
    //                             ],
    //                             "correctAnswer": 0
    //                         }
    //                     ],
    //                     "showQuestionNumbers": "off"
    //                 }
    //             ]
    //         }, {
    //             "name": "page6",
    //             "elements": [
    //                 {
    //                     "type": "panel",
    //                     "name": "panel6",
    //                     "elements": [
    //                         {
    //                             "type": "html",
    //                             "name": "inst6Text",
    //                             "html": `
    //                                 <h5>
    //                                     You Earn the Money in the Box(es) You Open
    //                                 </h5>
    //                                 <p>
    //                                     If you open <span id="two-boxer">both Boxes A and B</span>, you will earn:
    //                                 </p>
    //                                 <ol>
    //                                     <li>
    //                                         $${newcombBoxAValue} from Box A and
    //                                     </li>
    //                                     <li>
    //                                         $0 or $${newcombBoxBValue} from Box B, depending on <span id="ai-avatar">${(treatment.isAI) ? "AI's prediction" : "the random picker wheel's outcome"}</span>.
    //                                     </li>
    //                                 </ol>
    //                                 <p>
    //                                     If you open <span id="one-boxer">only Box B</span>, you will earn:
    //                                 </p>
    //                                 <ol>
    //                                     <li>
    //                                         $0 or $${newcombBoxBValue} from Box B, depending on <span id="ai-avatar">${(treatment.isAI) ? "AI's prediction" : "the random picker wheel's outcome"}</span>.
    //                                     </li>
    //                                 </ol>
    //                             `
    //                         }
    //                     ],
    //                     "showQuestionNumbers": "off"
    //                 }, {
    //                     "type": "panel",
    //                     "name": "q4",
    //                     "elements": [
    //                         {
    //                             "type": "html",
    //                             "html": `
    //                                 <h5>Comprehension Question</h5>
    //                             `
    //                         }, {
    //                             "type": "radiogroup",
    //                             "name": "question4",
    //                             "title": `Suppose the contents of Box B has been set to $${newcombBoxBValue}. Which option will allow you to earn the most?`,
    //                             "isRequired": true,
    //                             "choices": [
    //                                 {
    //                                     "value": 1,
    //                                     "text": `Open only Box A`
    //                                 }, {
    //                                     "value": 2,
    //                                     "text": `Open only Box B`
    //                                 }, {
    //                                     "value": 0,
    //                                     "text": `Open both boxes` + `${(runMode === "dev" ? " [correct]" : "")}`
    //                                 }
    //                             ],
    //                             "correctAnswer": 0
    //                         }
    //                     ],
    //                     "showQuestionNumbers": "off"
    //                 }
    //             ],
    //         }, {
    //             "name": "page7",
    //             "elements": [
    //                 {
    //                     "type": "panel",
    //                     "name": "panel7",
    //                     "elements": [
    //                         {
    //                             "type": "html",
    //                             "name": "inst7Text",
    //                             "html": `
    //                                 <h5>
    //                                     Interaction with AI
    //                                 </h5>
    //                                 <p>
    //                                     Once you finish reading this tutorial, <b>you will interact with <span id="ai-avatar">the AI</span></b> before moving to the point management task and receive suggestions.
    //                                     This <span id="ai-avatar">AI system</span> works by analyzing patterns in human data.
    //                                     AI models often make predictions about user intentions or likely next actions as part of how they generate responses.
    //                                 </p>
    //                                 <p>
    //                                     <span id="ai-avatar">The AI</span> will ask you some questions about your thoughts about the task and provide feedback based on your responses. Let's enjoy the conversation with <span id="ai-avatar">the AI</span>!
    //                                 </p>
    //                             `,
    //                             "visibleIf": "{treatment.allocatorType} = 'generativeAI'"
    //                         }
    //                     ],
    //                     "showQuestionNumbers": "off"
    //                 }
    //             ]
    //         }
    //     ]
    // };

    const surveyJson = {
        "showProgressBar": "aboveHeader",
        "progressBarType": "pages",
        "progressBarShowPageNumbers": true,
        "progressBarShowPageTitles": false,
        "widthMode": "static",
        "width": 900,
        "pages": [
            {
                "name": "page1",
                "elements": [
                    {
                        "type": "panel",
                        "elements": [
                            {
                                "type": "html",
                                "html": `
                                    <h5>
                                        Tutorial
                                    </h5>
                                    <br> 
                                    <p>
                                        This study is being conducted by <b>the School of Computer Science at Carnegie Mellon University</b>.
                                        As you read through this tutorial, please answer the four comprehension questions that look like this:
                                    </p>
                                `
                            }, {
                                "type": "radiogroup",
                                "name": "exampleQuestion",
                                "title": "(Example) Do you need to answer comprehension questions about this tutorial?",
                                "isRequired": false,
                                "choices": [
                                    "Yes",
                                    "No"
                                ]
                            }, {
                                "type": "html",
                                "html": `
                                    <p>
                                        If you answer the questions incorrectly <b>twice</b>, you will be asked to return this study.
                                        We only use these questions to ensure you understand the study details.
                                    </p>
                                `
                            }
                        ],
                        "showQuestionNumbers": "off"
                    }
                ]
            }, {
                "name": "page2",
                "elements": [
                    {
                        "type": "panel",
                        "elements": [
                            {
                                //     "type": "html",
                                //     "name": "inst2aText",
                                //     "html": `
                                //         <h5>
                                //             Decision Making Task
                                //         </h5>
                                //         <p>
                                //             In this study, <b>you are asked to make a choice between two options</b>. 
                                //             Based on your choice, you will receive an extra bonus.
                                //             Your final bonus will be between $0 and a maximum of $${newcombBoxAValue + newcombBoxBValue}.
                                //         </p>
                                //     `
                                // }, {
                                "type": "html",
                                "html": `
                                    <h5>
                                        Welcome to Decision Making Task!
                                    </h5>
                                    <p>
                                        In this task, you are presented with <b>two boxes</b>:
                                    </p>
                                    <img src="/fig/Newcomb/newcomb-boxes.png" className="mx-auto mb-2" />
                                    <ol>
                                        <li>
                                            <b>Box A</b> (left): <b>$${newcombBoxAValue}</b> is guaranteed.
                                        </li>
                                        <li>
                                            <b>Box B</b> (right): The contents are either <b>$0 or $${newcombBoxBValue}</b>${(p.isNone) ? ", and have already been determined" : `, determined by <span id='ai-avatar'>${p.a}</span>`}.
                                        </li>
                                    </ol>
                                    ${payoffNote}
                                `
                            }
                        ],
                        "showQuestionNumbers": "off"
                    }, {
                        "type": "panel",
                        "name": "q1",
                        "elements": [
                            {
                                "type": "html",
                                "html": `
                                    <h5>Comprehension Question</h5>
                                `
                            }, {
                                "type": "radiogroup",
                                "name": "question1",
                                "title": "Suppose you opened both boxes. How much money would you receive in this hypothetical situation?",
                                "isRequired": true,
                                "choicesOrder": "random",
                                "choices": [
                                    {
                                        "value": 4,
                                        "text": `Always $1`
                                    }, {
                                        "value": 0,
                                        "text": `Either $1 or $4` + `${(runMode === "dev" ? " [correct]" : "")}`
                                    }, {
                                        "value": 1,
                                        "text": "Either $0 or $3"
                                    }, {
                                        "value": 2,
                                        "text": "Always $3"
                                    }
                                ],
                                "correctAnswer": 0
                            }
                        ],
                        "showQuestionNumbers": "off"
                    }
                ]
            }, {
                "name": "page3",
                "elements": [
                    {
                        "type": "panel",
                        "name": "panel3",
                        "elements": [
                            {
                                "type": "html",
                                "name": "inst3Text",
                                "html": `
                                    <h5>
                                        Your Choice
                                    </h5>
                                    <p>
                                        You have two options:
                                    </p>
                                    <ol>
                                        <li>Open <span id="two-boxer">Box A and Box B</span> — you would receive $${newcombBoxAValue} from <b>Box A</b> + the contents of <b>Box B</b> ($0 or $${newcombBoxBValue})</li>
                                    </ol>
                                    <p>
                                        OR
                                    </p>
                                    <ol>
                                        <li>Open <span id="one-boxer">Box B only</span> — you would receive the contents of <b>Box B</b> ($0 or $${newcombBoxBValue})</li>
                                    </ol>
                                `
                            }, {
                                "type": "image",
                                "imageLink": "/fig/Newcomb/newcomb-options.png",
                                "imageHeight": 200,
                                "imageWidth": 800
                            }
                        ],
                        "showQuestionNumbers": "off"
                    }, {
                        "type": "panel",
                        "name": "q2",
                        "elements": [
                            {
                                "type": "html",
                                "html": `
                                    <h5>Comprehension Question</h5>
                                `
                            }, {
                                "type": "radiogroup",
                                "name": "question2",
                                "title": "What are the task's options?",
                                "isRequired": true,
                                "choicesOrder": "random",
                                "choices": [
                                    {
                                        "value": 3,
                                        "text": `Open both Box A and Box B, or open Box A only`
                                    }, {
                                        "value": 1,
                                        "text": "Open either Box A or Box B"
                                    }, {
                                        "value": 2,
                                        "text": "Get a guaranteed $1 or a chance to get $3"
                                    }, {
                                        "value": 0,
                                        "text": `Open both Box A and Box B, or open Box B only` + `${(runMode === "dev" ? " [correct]" : "")}`
                                    }
                                ],
                                "correctAnswer": 0
                            }
                        ],
                        "showQuestionNumbers": "off"
                    }
                ]
            }, {
                "name": "page4",
                "elements": [
                    {
                        "type": "panel",
                        "name": "panel4",
                        "elements": [
                            {
                                "type": "html",
                                "name": "inst4Text",
                                "html": `
                                    <h5>
                                        ${p.title} Decides the Contents of Box B
                                    </h5>
                                    <p>
                                        Before you make a decision, <span id='ai-avatar'>${p.a}</span> sets the contents of Box B ${(p.isPredictor) ? `based on ${p.pronounPoss} prediction` : ""}. 
                                        ${predictorIntro}
                                    </p>
                                `
                            }, {
                                "type": "image",
                                "imageLink": `/fig/Newcomb/newcomb-${(p.isPredictor) ? "predictions" : "labels"}.png`,
                                "imageHeight": 200,
                                "imageWidth": 800
                            }, {
                                "type": "html",
                                "html": `
                                    <ol>
                                        <li>
                                            If <span id="ai-avatar">${p.the}</span> ${(p.isPredictor) ? ` predicts "you will choose <span id='two-boxer'>two boxes</span>"` : ` draws the "<span id='two-boxer'>Two Boxes</span>" label`}, the contents of Box B are set to <b>$0</b>.
                                        </li>
                                    </ol>  
                                `
                            }, {
                                "type": "image",
                                "imageLink": `/fig/Newcomb/newcomb-${p.imageKey}-prediction-2box.png`,
                                "imageHeight": 200,
                                "imageWidth": 800
                            }, {
                                "type": "html",
                                "html": `
                                    <ol>
                                        <li>
                                            If <span id="ai-avatar">${p.the}</span>${(p.isPredictor) ? ` predicts "you will choose <span id='one-boxer'>one box</span>"` : ` draws the "<span id='one-boxer'>One Box</span>" label`}, the contents of Box B are set to <b>$${newcombBoxBValue}</b>.
                                        </li>
                                    </ol>  
                                `
                            }, {
                                "type": "image",
                                "imageLink": `/fig/Newcomb/newcomb-${p.imageKey}-prediction-1box.png`,
                                "imageHeight": 200,
                                "imageWidth": 800
                            }, {
                                "type": "html",
                                "html": `
                                    <p>
                                        Note that $${newcombBoxAValue} in Box A is fixed regardless of ${(p.isPredictor) ? `${p.possessive} prediction` : "the random generator's result"}.
                                    </p>
                                `
                            }
                        ],
                        "showQuestionNumbers": "off"
                    }, {
                        "type": "panel",
                        "name": "q3",
                        "elements": [
                            {
                                "type": "html",
                                "html": `
                                    <h5>Comprehension Question</h5>
                                `
                            }, {
                                "type": "radiogroup",
                                "name": "question3",
                                "title": `How is the contents of Box B determined?`,
                                "isRequired": true,
                                "choicesOrder": "random",
                                "choices": [
                                    {
                                        "value": 1,
                                        "text": `${(p.isPredictor) ? "Randomly" : "By an AI prediction"}`
                                    }, {
                                        "value": 0,
                                        "text": `${(p.isPredictor) ? `By ${p.possessive} prediction` : "Randomly"}` + `${(runMode === "dev" ? " [correct]" : "")}`
                                    }, {
                                        "value": 2,
                                        "text": `Depending on your choice`
                                    }, {
                                        "value": 3,
                                        "text": `Always $${newcombBoxAValue}`
                                    }
                                ],
                                "correctAnswer": 0
                            }
                        ],
                        "showQuestionNumbers": "off"
                    }
                ]
            }, {
                "name": "page5",
                "elements": [
                    {
                        "type": "panel",
                        "name": "panel5",
                        "elements": [
                            {
                                "type": "html",
                                "name": "inst5Text",
                                "html": `
                                    <h5>
                                        After Box B Is Set, You Decide
                                    </h5>
                                    <p>
                                        After <span id="ai-avatar">${p.the}</span> has ${(p.isPredictor) ? "predicted your choice and" : ""} determined the contents of Box B, you will decide either:
                                    </p>
                                    <ol>
                                        <li><span id="two-boxer">Box A and Box B </span> — a guaranteed $${newcombBoxAValue} from <b>Box A</b> + a chance of $0 or $${newcombBoxBValue} from <b>Box B</b></li>
                                    </ol>
                                    <p>
                                        OR
                                    </p>
                                    <ol>
                                        <li><span id="one-boxer">Box B only</span> — a chance of $0 or $${newcombBoxBValue} from <b>Box B</b></li>
                                    </ol>
                                    <p>
                                        Please keep in mind that the contents of Box B have already been fixed before you make a decision.    
                                        ${(treatment.skipResult) ? "" : `You will be informed of ${(p.isPredictor) ? `${p.possessive} prediction` : "the random generator's outcome"} at the end of the task.`}
                                    </p>
                                `
                            }, {
                                "type": "image",
                                "imageLink": `/fig/Newcomb/newcomb-options-2.png`,
                                "imageHeight": 200,
                                "imageWidth": 800
                            },
                        ],
                        "showQuestionNumbers": "off"
                    }, {
                        "type": "panel",
                        "name": "q4",
                        "elements": [
                            {
                                "type": "html",
                                "html": `
                                    <h5>Comprehension Question</h5>
                                `
                            }, {
                                "type": "radiogroup",
                                "name": "question4",
                                "title": `Under what condition will Box B contain $${newcombBoxBValue}?`,
                                "isRequired": true,
                                "choicesOrder": "random",
                                "choices": [
                                    {
                                        "value": 1,
                                        "text": `When you choose Box B only`
                                    }, {
                                        "value": 2,
                                        "text": `When ${(p.isPredictor) ? "a random generator draws the \"One Box\" label" : "an AI predicts you choose Box B only"}`
                                    }, {
                                        "value": 0,
                                        "text": `When ${(p.isPredictor) ? `${p.the} predicts you choose Box B only` : "the random generator draws the \"One Box\" label"}` + `${(runMode === "dev" ? " [correct]" : "")}`
                                    }, {
                                        "value": 3,
                                        "text": `When ${(p.isPredictor) ? `${p.the} predicts you choose both Box A and Box B` : "the random generator draws the \"Two Boxes\" label"}`
                                    }
                                ],
                                "correctAnswer": 0
                            }
                        ],
                        "showQuestionNumbers": "off"
                    }
                ]
                // }, {
                //     "name": "page6",
                //     "elements": [
                //         {
                //             "type": "panel",
                //             "name": "panel6",
                //             "elements": [
                //                 {
                //                     "type": "html",
                //                     "name": "inst6Text",
                //                     "html": `
                //                         <h5>
                //                             You Earn the Money in the Box(es) You Open
                //                         </h5>
                //                         <p>
                //                             If you open <span id="two-boxer">both Boxes A and B</span>, you will earn:
                //                         </p>
                //                         <ol>
                //                             <li>
                //                                 $${newcombBoxAValue} from Box A and
                //                             </li>
                //                             <li>
                //                                 $0 or $${newcombBoxBValue} from Box B, depending on <span id="ai-avatar">${(treatment.isAI) ? "AI's prediction" : "the random picker wheel's outcome"}</span>.
                //                             </li>
                //                         </ol>
                //                         <p>
                //                             If you open <span id="one-boxer">only Box B</span>, you will earn:
                //                         </p>
                //                         <ol>
                //                             <li>
                //                                 $0 or $${newcombBoxBValue} from Box B, depending on <span id="ai-avatar">${(treatment.isAI) ? "AI's prediction" : "the random picker wheel's outcome"}</span>.
                //                             </li>
                //                         </ol>
                //                     `
                //                 }
                //             ],
                //             "showQuestionNumbers": "off"
                //         }, {
                //             "type": "panel",
                //             "name": "q4",
                //             "elements": [
                //                 {
                //                     "type": "html",
                //                     "html": `
                //                         <h5>Comprehension Question</h5>
                //                     `
                //                 }, {
                //                     "type": "radiogroup",
                //                     "name": "question4",
                //                     "title": `Suppose the contents of Box B has been set to $${newcombBoxBValue}. Which option will allow you to earn the most?`,
                //                     "isRequired": true,
                //                     "choices": [
                //                         {
                //                             "value": 1,
                //                             "text": `Open only Box A`
                //                         }, {
                //                             "value": 2,
                //                             "text": `Open only Box B`
                //                         }, {
                //                             "value": 0,
                //                             "text": `Open both boxes` + `${(runMode === "dev" ? " [correct]" : "")}`
                //                         }
                //                     ],
                //                     "correctAnswer": 0
                //                 }
                //             ],
                //             "showQuestionNumbers": "off"
                //         }
                //     ],
            }, {
                "name": "page7",
                "elements": [
                    {
                        "type": "panel",
                        "name": "panel7",
                        "elements": [
                            {
                                "type": "html",
                                "name": "inst7Text",
                                "html": `
                                    <h5>
                                        Interaction with AI
                                    </h5>
                                    <p>
                                        Once you finish reading this tutorial, <b>you will interact with <span id="ai-avatar">the AI</span></b> before moving to the task.
                                        This <span id="ai-avatar">AI system</span> works by analyzing patterns in human data.
                                        AI models often make predictions about user intentions or likely next actions as part of how they generate responses.
                                    </p>
                                    <p>
                                        <span id="ai-avatar">The AI</span> will ask you some questions about yourself and provide feedback based on your responses. Let's enjoy the conversation with <span id="ai-avatar">the AI</span>!
                                    </p>
                                `,
                                "visibleIf": "{treatment.allocatorType} = 'generativeAI'"
                            }
                        ],
                        "showQuestionNumbers": "off"
                    }
                ]
            }, {
                "name": "page7",
                "elements": [
                    {
                        "type": "panel",
                        "name": "panel7",
                        "elements": [
                            {
                                "type": "html",
                                "name": "inst7Text",
                                "html": `
                                    <h5>
                                        Random Generator Check
                                    </h5>
                                    <p>
                                        Once you finish reading this tutorial, you will try <span id="ai-avatar">the random generator</span> before moving to the task.
                                        This <span id="ai-avatar">random generator</span> works by randomly drawing one of two labels with equal probabilities.
                                    </p>
                                    <p>
                                        The outcome will be always independent and different each time you try it.
                                        The outcome of this check will not affect the result of the main task.
                                    </p>
                                `,
                                "visibleIf": "{treatment.isInteractive} = 'true' and {treatment.allocatorType} = 'random'"
                            }
                        ],
                        "showQuestionNumbers": "off"
                    }
                ]
            }, {
                "name": "page7",
                "elements": [
                    {
                        "type": "panel",
                        "name": "panel7",
                        "elements": [
                            {
                                "type": "html",
                                "name": "inst7Text",
                                "html": `
                                    <h5>
                                        Iterative Rounds
                                    </h5>
                                    <p>
                                        You will repeat the decision-making task for <b>multiple rounds</b>.
                                        In each round, you can check the outcome based on your choice and <span id="ai-avatar">${(p.isPredictor) ? `${p.possessive} prediction` : "the random generator's outcome"}</span>.
                                    </p>
                                    <p>
                                        The final bonus will be calculated based on the <b>average</b> rewards you earn across all rounds.
                                    </p>
                                `,
                                "visibleIf": "{treatment.nRound} > 1"
                            }
                        ],
                        "showQuestionNumbers": "off"
                    }
                ]
            }, {
                "name": "page8",
                "elements": [
                    {
                        "type": "panel",
                        "name": "panel8",
                        "elements": [
                            {
                                "type": "html",
                                "name": "inst8Text",
                                "html": `
                                    <h5>
                                        You have completed the tutorial!
                                    </h5>
                                    ${(treatment.isHypothetical) ? `
                                    <p>
                                        Remember that this is a hypothetical decision-making situation. You will not receive the money described in the scenario. However, please <b>consider the situation carefully and choose the option you would actually prefer</b> if you were facing this decision.
                                    </p>
                                    ` : ""}
                                    <p>
                                        Please click the "Complete" button below to proceed to the Decision Making Task.
                                    </p>
                                `,
                            }
                        ],
                        "showQuestionNumbers": "off"
                    }
                ]
            }
        ]
    };

    // exp4 (the only treatments with `predictorType`): a hypothetical "Decision-Making Survey".
    //   - page1 states up front that the situation is hypothetical and the payment is fixed
    //   - page2 only presents the two boxes; the predictor is not mentioned until page4
    //   - every other page (and the page2 comprehension question) keeps the original wording
    if (isExp4) {
        const instruction = (name, elements) => ({
            "type": "panel",
            "name": name,
            "elements": elements,
            "showQuestionNumbers": "off"
        });
        const html = (content) => ({ "type": "html", "html": content });
        // the comprehension question of page2 is kept as it was
        const originalQ1 = surveyJson.pages.find((page) => page.name === "page2").elements[1];

        const exp4Pages = {
            page1: [
                instruction("panel1", [
                    html(`
                        <h5>
                            Welcome to the Decision-Making Survey
                        </h5>
                        <br>
                        <p>
                            In this survey, you will be asked to consider a <b>hypothetical decision-making situation</b> and indicate what you would choose.
                            The situation involves possible monetary rewards, but <b>you will not receive the money described in the scenario</b>.
                            Instead, you will receive <b>a fixed payment for completing the survey, regardless of your decision</b>.
                            Please answer as you would if you were actually facing the situation.
                        </p>
                        <p>
                            As you read through the instructions, please answer the comprehension questions on the following pages.
                            If you answer a question incorrectly <b>twice</b>, you will be asked to return this study.
                            We only use these questions to ensure you understand the study details.
                        </p>
                    `)
                ])
            ],
            page2: [
                instruction("panel2", [
                    html(`
                        <h5>
                            Decision Making with Two Boxes
                        </h5>
                        <p>
                            Suppose you are presented with <b>two boxes</b>, Box A and Box B.
                        </p>
                        <img src="/fig/Newcomb/newcomb-boxes.png" className="mx-auto mb-2" />
                        <ol>
                            <li>
                                <b>Box A</b> (left) contains <b>$${newcombBoxAValue}</b>.
                            </li>
                            <li>
                                <b>Box B</b> (right) contains either <b>$0 or $${newcombBoxBValue}</b>. You do not know which amount is inside Box B.
                            </li>
                        </ol>
                        <p>
                            You will have an opportunity to choose either Box B alone or both boxes.
                            Before making your choice, you will learn how the amount in Box B was determined.
                        </p>
                    `)
                ]),
                originalQ1
            ]
        };

        for (const page of surveyJson.pages) {
            if (exp4Pages[page.name]) page.elements = exp4Pages[page.name];
        }

        // AI / human predictor: the original page4 is split into two pages.
        //   page4a - the predictor predicts the participant's choice
        //   page4  - the predictor sets the contents of Box B based on that prediction
        // The sentences, images and the comprehension question are the original ones, only redistributed.
        if (p.isPredictor) {
            const page4Index = surveyJson.pages.findIndex((page) => page.name === "page4");
            const page4 = surveyJson.pages[page4Index];
            const [panel4, q3] = page4.elements;
            // panel4.elements: [intro text, predictions image, ...rules of Box B (texts and images)]
            const [, predictionsImage, ...boxBRules] = panel4.elements;

            const page4a = {
                "name": "page4a",
                "elements": [
                    instruction("panel4a", [
                        html(`
                            <h5>
                                ${p.title} Predicts Your Choice
                            </h5>
                            <p>
                                Before you make your choice, <span id='ai-avatar'>${p.type === "AI" ? "an AI system" : "another person"}</span> predicts whether you will choose <span id='two-boxer'>both boxes</span> or <span id='one-boxer'>Box B only</span>.
                                ${(treatment.reliability === "reliable") ? `<b><span id='ai-avatar'>${p.type === "AI" ? "The AI system" : "This person"}</span> has been trained to predict people's choices in this task and has correctly predicted 98 out of 100 previous participants' choices.</b>` : ""}
                            </p>
                        `),
                        predictionsImage,
                        // illustration of the predictor (cut out of newcomb-{ai,human}-prediction-*.png)
                        {
                            "type": "image",
                            "imageLink": `/fig/Newcomb/newcomb-${p.imageKey}-predictor.png`,
                            "imageHeight": 200,
                            "imageWidth": 800
                        }
                    ])
                ]
            };
            page4.elements = [
                instruction("panel4", [
                    html(`
                        <h5>
                            The Contents of Box B are fixed based on ${p.title}'s Prediction
                        </h5>
                        <p>
                            The prediction will then be used to determine the contents of Box B: <b>$0</b> if <span id='ai-avatar'>${p.the}</span> predicts <span id='two-boxer'>both boxes</span>, and <b>$${newcombBoxBValue}</b> if <span id='ai-avatar'>${p.the}</span> predicts <span id='one-boxer'>Box B only</span>.
                        </p>
                        <p>
                            <b>The contents of Box B are fixed before you make your choice and cannot be changed afterward</b>.
                        </p>
                    `),
                    ...boxBRules
                ]),
                q3
            ];
            surveyJson.pages.splice(page4Index, 0, page4a);
        }
    }

    // exp4 "No prediction": no predictor is mentioned anywhere; the tutorial only says
    // that the contents of Box B have already been determined.
    if (p.isNone) {
        const correctMark = (runMode === "dev" ? " [correct]" : "");
        const question = (name, title, choices) => ({
            "type": "panel",
            "name": `q${name.slice(-1)}`,
            "elements": [
                { "type": "html", "html": `<h5>Comprehension Question</h5>` },
                { "type": "radiogroup", "name": name, "title": title, "isRequired": true, "choicesOrder": "random", "choices": choices, "correctAnswer": 0 }
            ],
            "showQuestionNumbers": "off"
        });
        const nonePages = {
            page5: [
                {
                    "type": "panel",
                    "name": "panel5",
                    "elements": [
                        {
                            "type": "html",
                            "name": "inst5Text",
                            "html": `
                                <h5>
                                    Box B Is Already Set, and You Decide
                                </h5>
                                <p>
                                    With the contents of Box B already determined, you will decide either:
                                </p>
                                <ol>
                                    <li><span id="two-boxer">Box A and Box B </span> — a guaranteed $${newcombBoxAValue} from <b>Box A</b> + a chance of $0 or $${newcombBoxBValue} from <b>Box B</b></li>
                                </ol>
                                <p>
                                    OR
                                </p>
                                <ol>
                                    <li><span id="one-boxer">Box B only</span> — a chance of $0 or $${newcombBoxBValue} from <b>Box B</b></li>
                                </ol>
                                <p>
                                    Please keep in mind that the contents of Box B have already been fixed before you make a decision.
                                    ${(treatment.skipResult) ? "" : "You will be informed of the contents of Box B at the end of the task."}
                                </p>
                            `
                        }, {
                            "type": "image",
                            "imageLink": `/fig/Newcomb/newcomb-options-2.png`,
                            "imageHeight": 200,
                            "imageWidth": 800
                        }
                    ],
                    "showQuestionNumbers": "off"
                },
                question("question4", "When you make your decision, what do you know about the contents of Box B?", [
                    { "value": 0, "text": `They are already determined to be either $0 or $${newcombBoxBValue}, but you do not know which` + correctMark },
                    { "value": 1, "text": `Box B certainly contains $${newcombBoxBValue}` },
                    { "value": 2, "text": `Box B is certainly empty` },
                    { "value": 3, "text": `They will be determined after you decide` }
                ])
            ]
        };
        for (const page of surveyJson.pages) {
            if (nonePages[page.name]) page.elements = nonePages[page.name];
        }
        // page4 (how Box B is determined) and its comprehension question are left out in this condition.
        surveyJson.pages = surveyJson.pages.filter((page) => page.name !== "page4");
    }

    const nComprehensionFailed = player.get('nComprehensionFailed') || 0;
    const failedQuestions = player.get('failedQuestions');

    const introText = new Model(surveyJson);
    introText.applyTheme(themeJson);
    introText.showCompletedPage = false;
    introText.setVariable("treatment", treatment);
    introText.completeText = 'Complete';

    // Restore the survey state
    const storageItemKey = `survey_state_${player.id}_Newcomb`;
    function saveSurveyData(survey) {
        const data = survey.data;
        data.pageNo = survey.currentPageNo;
        window.localStorage.setItem(storageItemKey, JSON.stringify(data));
    }
    // Save survey results to the local storage
    introText.onValueChanged.add(saveSurveyData);
    introText.onCurrentPageChanged.add(saveSurveyData);
    // Restore survey results
    const prevData = window.localStorage.getItem(storageItemKey) || null;
    if (prevData) {
        const data = JSON.parse(prevData);
        introText.data = data;
        if (data.pageNo) {
            introText.currentPageNo = data.pageNo;
        }
    }


    // function validateDomain(sender, options) {
    //     const question = options.question;
    //     const name = question.name;
    //     const value = options.value;
    //     const correctAnswer = question.correctAnswer;
    //     // const nFailed = player.get(`${name}_nFailed`) || 0;
    //     // localStorageから失敗回数を取得
    //     const nFailed = parseInt(localStorage.getItem(`${storageItemKey}_${name}_nFailed`)) || 0;
    //     console.log(`Validating question ${name}: answer=${value}, correctAnswer=${correctAnswer}, nFailed=${nFailed}`);

    //     // if (failedQuestions && failedQuestions.includes(name)) {
    //     //     // Previously failed question: always mark as incorrect
    //     //     options.isValid = false;
    //     //     return;
    //     // }

    //     if (value == correctAnswer) {
    //         options.isValid = true;
    //     } else {
    //         options.isValid = false;
    //         if (nFailed + 1 >= 2) {
    //             // localStorageをクリア
    //             localStorage.removeItem(`${storageItemKey}_${name}_nFailed`);
    //             console.log(`Question ${name} failed twice: marking for dropout`);
    //             // Failed twice: mark for dropout
    //             player.set("dropoutReason", "comprehension");
    //         } else {
    //             // Increment the failure count for this question
    //             // localStorageに失敗回数を保存
    //             localStorage.setItem(`${storageItemKey}_${name}_nFailed`, nFailed + 1);
    //             console.log(`Question ${name} failed ${nFailed + 1} time(s)`);
    //         }
    //         options.error = "Your answer is incorrect. Please review the tutorial and try again.";
    //     }
    // }
    // introText.onValidateQuestion.add(validateDomain);
    introText.onCurrentPageChanging.add((sender, options) => {
        // options.isNextPage: trueならnext, falseならprev
        if (!options.isNextPage) {
            // prevボタンのときは検証しない
            return;
        }
        const page = options.oldCurrentPage;
        let hasError = false;
        page.questions.forEach((question) => {
            // correctAnswerが設定されている設問のみ検証
            if (question.correctAnswer !== undefined) {
                const value = sender.data[question.name];
                if (value != question.correctAnswer) {
                    hasError = true;
                    // エラー表示
                    question.addError("Your answer is incorrect. Please review the tutorial and try again.");
                    // 失敗回数管理（例: localStorage利用）
                    const nFailed = parseInt(localStorage.getItem(`${storageItemKey}_${question.name}_nFailed`)) || 0;
                    if (nFailed + 1 >= 2) {
                        localStorage.removeItem(`${storageItemKey}_${question.name}_nFailed`);
                        player.set("failedQuestion", question.name);
                        player.set("dropoutReason", "comprehension");
                    } else {
                        localStorage.setItem(`${storageItemKey}_${question.name}_nFailed`, nFailed + 1);
                    }
                }
            }
        });
        if (hasError) {
            options.allowChanging = false; // ページ遷移をブロック
        }
    });

    // const correctStr = "Correct";
    // const incorrectStr = "Incorrect";

    // // Builds an HTML string to display in a question title
    // function getTextHtml(text, str, isCorrect) {
    //     if (text.indexOf(str) < 0)
    //         return undefined;

    //     return text.substring(0, text.indexOf(str)) +
    //         "<span class='" + (isCorrect ? "correctAnswer" : "incorrectAnswer") + "'>" +
    //         str +
    //         "</span>";
    // }

    // introText.onTextMarkdown.add((_, options) => {
    //     const text = options.text;
    //     let html = getTextHtml(text, correctStr, true);
    //     if (!html) {
    //         html = getTextHtml(text, incorrectStr, false);
    //     }
    //     if (!!html) {
    //         // Set an HTML string with the "Correct" or "Incorrect" suffix for display
    //         options.html = html;
    //     }
    // });


    // フォーム完了時に保存データをクリア
    introText.onComplete.add((sender, options) => {
        // if (sender.getCorrectedAnswerCount() < sender.getQuizQuestionCount()) {
        //     // Which question is incorrect?
        //     let allQuestions = sender.getAllQuestions();
        //     allQuestions.forEach(question => {
        //         if (question.isAnswerCorrect !== undefined && !question.isAnswerCorrect()) {
        //             failedQuestions.push(question.name);
        //         }
        //     });
        //     player.set('nComprehensionFailed', nComprehensionFailed + 1);
        //     player.set('failedQuestions', [...new Set(failedQuestions)]);
        //     if (player.get('nComprehensionFailed') >= 2) {
        //         player.set('dropoutReason', 'comprehension');
        //     } else {
        //         localStorage.removeItem(storageItemKey);
        //         alert("Oops! You have answered one or more questions incorrectly. Please review the explanation and try again.");
        //     }
        // } else {
        setTimeout(() => {
            localStorage.removeItem(storageItemKey);
            // player.set("introDone", true);
            if (treatment.isInteractive) {
                player.set("introStepIndex", 1);
                player.set("introStep", (treatment.allocatorType === "generativeAI") ? "Conversation with AI" : "Random Generator Check");
            } else {
                player.set("introStepIndex", 1);
                player.set("introStep", "Decision making task");
                player.set("introDone", true);
            }
            // }

        }, 200);
        // }
    });

    const failureHTML = `
        <h5>You have failed the comprehension test twice...</h5>
        <br>
        <p>
            Unfortunately you are not able to continue this study. 
            Please go back to Prolific and <b>return the study</b>.
            However, you will still receive <b>a bonus of $${returnBonus}</b> as a compensation for your time within a few business days.
        </p>
        <br>
        <p>Thank you for your participation!</p>
    `;
    const failureJson = {
        "completeText": "Return to Prolific",
        "elements": [
            {
                "type": "panel",
                "name": "exitSurvey",
                "elements": [
                    {
                        "type": "html",
                        "name": "exitSurveyInfo",
                        "html": failureHTML,
                    }
                ]
            }
        ]
    };
    const PROLIFIC_CODE_COMPREHENSION = player.get('PROLIFIC_CODE_COMPREHENSION');
    const surveyFailure = new Model(failureJson);
    surveyFailure.applyTheme(themeJson);
    surveyFailure.showCompleteButton = true;
    surveyFailure.onComplete.add((result) => {
        // if failed to assign a group
        if (player.get("dropoutReason") === "comprehension") {
            setTimeout(() => {
                window.location.href = `https://app.prolific.com/submissions/complete?cc=${PROLIFIC_CODE_COMPREHENSION}`; // Redirect to Prolific
            }, 1000);
        }
    });


    return (
        <>
            <div className="flex h-full">
                <div className="mx-auto w-full">
                    {/* {timeRemaining} */}
                    <Survey model={(player.get("dropoutReason") === "comprehension") ? surveyFailure : introText} />
                </div>
            </div>
        </>
    );
}