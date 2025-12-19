import React, { useState } from "react";
import { Survey } from "survey-react-ui";
import { Model } from 'survey-core';
import 'survey-core/defaultV2.min.css';
import { themeJson } from "../../styles/survey_theme.js";
import {
    useGame,
    usePlayer
} from "@empirica/core/player/classic/react";

export function Tutorial({ next }) {
    const game = useGame();
    const player = usePlayer();
    const treatment = game.get('treatment');
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
                                            <b>Box B</b> (right): The contents are either <b>$0 or $${newcombBoxBValue}</b>, determined by <span id='ai-avatar'>${(treatment.isAI) ? "an AI" : "a random generator"}</span>.
                                        </li>
                                    </ol>
                                    You will receive the contents of the box(es) you open as a bonus.
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
                                "title": "If you open both Box A and Box B, how much could you get in total?",
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
                                        <li>Open <span id="two-boxer">Box A and Box B</span> — you will receive $${newcombBoxAValue} from <b>Box A</b> + the contents of <b>Box B</b> ($0 or $${newcombBoxBValue})</li>
                                    </ol>
                                    <p>
                                        OR
                                    </p>
                                    <ol>
                                        <li>Open <span id="one-boxer">Box B only</span> — you will receive the contents of <b>Box B</b> ($0 or $${newcombBoxBValue})</li>
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
                                        ${(treatment.isAI) ? "AI" : "Random Generator"} Decides the Contents of Box B
                                    </h5>
                                    <p>
                                        Before you make a decision, <span id='ai-avatar'>${(treatment.isAI) ? "an AI" : "a random generator"}</span> sets the contents of Box B ${(treatment.isAI) ? "based on its prediction" : ""}. 
                                        ${(treatment.isAI) ? `<span id='ai-avatar'>The AI</span> is specifically designed for this task to predict</b> whether people will choose <span id='two-boxer'>two boxes</span> or <span id='one-boxer'>one box</span>:` : `One of two labels below will be <b>randomly drawn</b> with equal probabilities:`}
                                    </p>
                                `
                            }, {
                                "type": "image",
                                "imageLink": `/fig/Newcomb/newcomb-${(treatment.isAI) ? "predictions" : "labels"}.png`,
                                "imageHeight": 200,
                                "imageWidth": 800
                            }, {
                                "type": "html",
                                "html": `
                                    <ol>
                                        <li>
                                            If <span id="ai-avatar">${(treatment.isAI) ? `the AI` : `the random generator`}</span> ${(treatment.isAI) ? ` predicts "you will choose <span id='two-boxer'>two boxes</span>"` : ` draws the "<span id='two-boxer'>Two Boxes</span>" label`}, the contents of Box B are set to <b>$0</b>.
                                        </li>
                                    </ol>  
                                `
                            }, {
                                "type": "image",
                                "imageLink": `/fig/Newcomb/newcomb-${(treatment.isAI) ? "ai" : "label"}-prediction-2box.png`,
                                "imageHeight": 200,
                                "imageWidth": 800
                            }, {
                                "type": "html",
                                "html": `
                                    <ol>
                                        <li>
                                            If <span id="ai-avatar">${(treatment.isAI) ? "the AI" : "the random generator"}</span>${(treatment.isAI) ? ` predicts "you will choose <span id='one-boxer'>one box</span>"` : ` draws the "<span id='one-boxer'>One Box</span>" label`}, the contents of Box B are set to <b>$${newcombBoxBValue}</b>.
                                        </li>
                                    </ol>  
                                `
                            }, {
                                "type": "image",
                                "imageLink": `/fig/Newcomb/newcomb-${(treatment.isAI) ? "ai" : "label"}-prediction-1box.png`,
                                "imageHeight": 200,
                                "imageWidth": 800
                            }, {
                                "type": "html",
                                "html": `
                                    <p>
                                        Note that $${newcombBoxAValue} in Box A is fixed regardless of the ${(treatment.isAI) ? "AI's prediction" : "random generator's result"}.
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
                                        "text": `${(treatment.isAI) ? "Randomly" : "By an AI prediction"}`
                                    }, {
                                        "value": 0,
                                        "text": `${(treatment.isAI) ? "By the AI's prediction" : "Randomly"}` + `${(runMode === "dev" ? " [correct]" : "")}`
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
                                        After <span id="ai-avatar">${(treatment.isAI) ? "the AI</span> has predicted your choice and" : "the random generator</span> has"} determined the contents of Box B, you will decide either:
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
                                        You will be informed of ${(treatment.isAI) ? "the AI's prediction" : "the random generator's outcome"} at the end of the task.
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
                                        "text": `When ${(treatment.isAI) ? "a random generator draws the \"One Box\" label" : "an AI predicts you choose Box B only"}`
                                    }, {
                                        "value": 0,
                                        "text": `When ${(treatment.isAI) ? "the AI predicts you choose Box B only" : "When the random generator draws the \"One Box\" label"}` + `${(runMode === "dev" ? " [correct]" : "")}`
                                    }, {
                                        "value": 3,
                                        "text": `When ${(treatment.isAI) ? "the AI predicts you choose both Box A and Box B" : "the random generator draws the \"Two Boxes\" label"}`
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