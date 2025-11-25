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
                                "type": "html",
                                "name": "inst2aText",
                                "html": `
                                    <h5>
                                        Decision Making Task
                                    </h5>
                                    <p>
                                        In this study, <b>you are asked to make a choice between two options</b>. 
                                        Based on your choice, you will receive an extra bonus.
                                        Your final bonus will be between $0 and a maximum of $${newcombBoxAValue + newcombBoxBValue}.
                                    </p>
                                `
                            }, {
                                "type": "html",
                                "html": `
                                    <p>
                                        First, you are presented with <b>two boxes</b>:
                                    </p>
                                    <img src="/fig/Newcomb/newcomb-boxes.png" className="mx-auto mb-2" />
                                    <ol>
                                        <li>
                                            <b>Box A</b> (left) is transparent, and you can see the contents inside.
                                            $${newcombBoxAValue} is guaranteed in this box.
                                        </li>
                                        <li>
                                            <b>Box B</b> (right) is opaque, and you cannot see the contents inside.
                                            The contents are either $0 or $${newcombBoxBValue}.
                                        </li>
                                    </ol>
                                `
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
                                        Open Two Boxes or One Box
                                    </h5>
                                    <p>
                                        Then, you will be asked to choose either option:
                                    </p>
                                    <ol>
                                        <li>
                                            Open <span id="two-boxer"><b>both Box A and Box B</b></span> (Two Boxes)
                                        </li>
                                        <li>
                                            Open <span id="one-boxer"><b>Box B only</b></span> (One Box)
                                        </li>
                                    </ol>
                                `
                            }, {
                                "type": "image",
                                "imageLink": "/fig/Newcomb/newcomb-options.png",
                                "imageHeight": 200,
                                "imageWidth": 800
                            }, {
                                "type": "html",
                                "name": "inst3Text",
                                "html": `
                                    <p>
                                        Note that your choice is <b>NOT</b> between opening Box A or Box B.
                                        Instead, you choose <b>whether to open two boxes or one box</b>.
                                    </p>
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
                                "title": "What are the task's options?",
                                "isRequired": true,
                                // "choicesOrder": "random",
                                "choices": [
                                    {
                                        "value": 0,
                                        "text": `Both boxes or Box B only` + `${(runMode === "dev" ? " [correct]" : "")}`
                                    }, {
                                        "value": 1,
                                        "text": "Box A or Box B"
                                    }, {
                                        "value": 2,
                                        "text": "Open or close the boxes"
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
                                        ${(treatment.isAI) ? "AI" : "Random Picker Wheel"} Decides the Contents of Box B
                                    </h5>
                                    <p>
                                        Here, we introduce <span id="ai-avatar">${(treatment.isAI) ? "an AI system" : "a random picker wheel"}</span> to decide the contents of Box B before you make a choice.
                                        ${(treatment.isAI) ? "<b><span id='ai-avatar'>The AI</span> is specifically designed for this task to predict</b> whether people will choose <span id='two-boxer'>two boxes</span> or <span id='one-boxer'>one box</span>, which then sets the content of Box B.</span>" : "The wheel has two types of indications as described below, and the contents of Box B will be set according to the indication <b>randomly drawn</b> with equal probability."}
                                    </p>
                                    <p>
                                        <b>If <span id="ai-avatar">${(treatment.isAI) ? "the AI predicts" : "the random picker wheel indicates"}</span> "you will choose <span id="two-boxer">two boxes (Boxes A and B)</span>", the contents of Box B are set to $0</b>.
                                    </p>  
                                `
                            }, {
                                "type": "image",
                                "imageLink": `/fig/Newcomb/newcomb-${(treatment.isAI) ? "ai" : "lottery"}-prediction-2box.png`,
                                "imageHeight": 200,
                                "imageWidth": 800
                            }, {
                                "type": "html",
                                "html": `
                                    <p>
                                        <b>If <span id="ai-avatar">${(treatment.isAI) ? "the AI predicts" : "the random picker wheel indicates"}</span> "you will choose <span id="one-boxer">one box (Box B)</span>", the contents of Box B are set to $${newcombBoxBValue}</b>.
                                    </p>
                                `
                            }, {
                                "type": "image",
                                "imageLink": `/fig/Newcomb/newcomb-${(treatment.isAI) ? "ai" : "lottery"}-prediction-1box.png`,
                                "imageHeight": 200,
                                "imageWidth": 800
                            }, {
                                "type": "html",
                                "html": `
                                    <p>
                                        Note that Box A contains $${newcombBoxAValue} regardless of the ${(treatment.isAI) ? "prediction" : "random picker wheel's result"}.
                                    </p>
                                `
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
                                "title": `How much money is in Box B if ${(treatment.isAI) ? "the AI predicts" : "the random picker wheel indicates"} you will open both boxes?`,
                                "isRequired": true,
                                // "choicesOrder": "random",
                                "choices": [
                                    {
                                        "value": 1,
                                        "text": `$${newcombBoxBValue}`
                                    }, {
                                        "value": 0,
                                        "text": `$0` + `${(runMode === "dev" ? " [correct]" : "")}`
                                    }, {
                                        "value": 2,
                                        "text": `$${newcombBoxAValue}`
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
                                        You Make Your Choice After ${(treatment.isAI) ? "AI's Prediction" : "Random Draw"}
                                    </h5>
                                    <p>
                                        Once <span id="ai-avatar">${(treatment.isAI) ? "the AI has predicted</span> your choice and" : "the random picker wheel</span> has"} determined the contents of Box B, you will choose whether to open <span id="two-boxer">two boxes</span> or <span id="one-boxer">one box</span>.
                                        You will not be informed of ${(treatment.isAI) ? "the AI's prediction" : "the random picker wheel's outcome"} in advance.
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
                                "title": `When you choose one of the two options, has Box B's contents already been determined?`,
                                "isRequired": true,
                                "choicesOrder": "random",
                                "choices": [
                                    {
                                        "value": 0,
                                        "text": `Yes` + `${(runMode === "dev" ? " [correct]" : "")}`
                                    }, {
                                        "value": 1,
                                        "text": `No`
                                    }, {
                                        "value": 2,
                                        "text": `It depends on the ${(treatment.isAI) ? "AI's prediction" : "random picker wheel's outcome"}.`
                                    }
                                ],
                                "correctAnswer": 0
                            }
                        ],
                        "showQuestionNumbers": "off"
                    }
                ]
            }, {
                "name": "page6",
                "elements": [
                    {
                        "type": "panel",
                        "name": "panel6",
                        "elements": [
                            {
                                "type": "html",
                                "name": "inst6Text",
                                "html": `
                                    <h5>
                                        You Earn the Money in the Box(es) You Open
                                    </h5>
                                    <p>
                                        If you open <span id="two-boxer">both Boxes A and B</span>, you will earn:
                                    </p>
                                    <ol>
                                        <li>
                                            $${newcombBoxAValue} from Box A and
                                        </li>
                                        <li>
                                            $0 or $${newcombBoxBValue} from Box B, depending on <span id="ai-avatar">${(treatment.isAI) ? "AI's prediction" : "the random picker wheel's outcome"}</span>.
                                        </li>
                                    </ol>
                                    <p>
                                        If you open <span id="one-boxer">only Box B</span>, you will earn:
                                    </p>
                                    <ol>
                                        <li>
                                            $0 or $${newcombBoxBValue} from Box B, depending on <span id="ai-avatar">${(treatment.isAI) ? "AI's prediction" : "the random picker wheel's outcome"}</span>.
                                        </li>
                                    </ol>
                                `
                            }
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
                                "title": `Suppose the contents of Box B has been set to $${newcombBoxBValue}. Which option will allow you to earn the most?`,
                                "isRequired": true,
                                "choices": [
                                    {
                                        "value": 1,
                                        "text": `Open only Box A`
                                    }, {
                                        "value": 2,
                                        "text": `Open only Box B`
                                    }, {
                                        "value": 0,
                                        "text": `Open both boxes` + `${(runMode === "dev" ? " [correct]" : "")}`
                                    }
                                ],
                                "correctAnswer": 0
                            }
                        ],
                        "showQuestionNumbers": "off"
                    }
                ],
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
                                        Once you finish reading this tutorial, <b>you will interact with <span id="ai-avatar">the AI</span></b> before moving to the point management task and receive suggestions.
                                    </p>
                                    <p>
                                        <span id="ai-avatar">The AI</span> will ask you some questions about your thoughts about the task and provide feedback based on your responses. Let's enjoy the conversation with <span id="ai-avatar">the AI</span>!
                                    </p>
                                `,
                                "visibleIf": "{treatment.allocatorType} = 'generativeAI'"
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
    // introText.completeText = 'Join the lobby'; 
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

    const correctStr = "Correct";
    const incorrectStr = "Incorrect";

    // Builds an HTML string to display in a question title
    function getTextHtml(text, str, isCorrect) {
        if (text.indexOf(str) < 0)
            return undefined;

        return text.substring(0, text.indexOf(str)) +
            "<span class='" + (isCorrect ? "correctAnswer" : "incorrectAnswer") + "'>" +
            str +
            "</span>";
    }

    introText.onTextMarkdown.add((_, options) => {
        const text = options.text;
        let html = getTextHtml(text, correctStr, true);
        if (!html) {
            html = getTextHtml(text, incorrectStr, false);
        }
        if (!!html) {
            // Set an HTML string with the "Correct" or "Incorrect" suffix for display
            options.html = html;
        }
    });

    // フォーム完了時に保存データをクリア
    introText.onComplete.add((sender, options) => {
        if (sender.getCorrectedAnswerCount() < sender.getQuizQuestionCount()) {
            // Which question is incorrect?
            let allQuestions = sender.getAllQuestions();
            allQuestions.forEach(question => {
                if (question.isAnswerCorrect !== undefined && !question.isAnswerCorrect()) {
                    failedQuestions.push(question.name);
                }
            });
            player.set('nComprehensionFailed', nComprehensionFailed + 1);
            player.set('failedQuestions', [...new Set(failedQuestions)]);
            if (player.get('nComprehensionFailed') >= 2) {
                player.set('dropoutReason', 'comprehension');
            } else {
                localStorage.removeItem(storageItemKey);
                alert("Oops! You have answered one or more questions incorrectly. Please review the explanation and try again.");
            }
        } else {
            setTimeout(() => {
                localStorage.removeItem(storageItemKey);
                // player.set("introDone", true);
                player.set("introStepIndex", 1);
                player.set("introStep", (treatment.allocatorType === "generativeAI") ? "Conversation with AI" : "Pre-task survey");
                // }

            }, 200);
        }
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