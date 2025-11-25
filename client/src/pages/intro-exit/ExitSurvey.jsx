import {
  useGame,
  usePlayer
} from "@empirica/core/player/classic/react";
import React from "react";
import { Survey } from "survey-react-ui";
import { Model } from 'survey-core';
import 'survey-core/defaultV2.min.css';
import { themeJson } from "../../styles/survey_theme.js";
import {
  AiLiteracySurvey,
  DeterminismSurvey,
  IdeologySurvey,
  RiskSurvey,
  SoepSurvey
} from "../intro-exit/SurveyItems.jsx";

export function ExitSurvey({ next }) {
  const game = useGame();
  const treatment = game?.get("treatment");
  const player = usePlayer();
  const totalScore = player.get("playerScore") || 0;
  const PROLIFIC_CODE = player.get('PROLIFIC_CODE');
  const PROLIFIC_CODE_COMPREHENSION = player.get('PROLIFIC_CODE_COMPREHENSION');

  let surveyJson;

  function saveSurveyData(survey) {
    const data = survey.data;
    data.pageNo = survey.currentPageNo;
    window.localStorage.setItem(storageItemKey, JSON.stringify(data));
  }

  if (player.get("dropoutReason") === "comprehension") {
    // If failed to assign a group
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
        surveyJson = {
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
        }
  } else {
    surveyJson = {
      "widthMode": "static",
      "width": 900,
      "completeText": "Complete Study",
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "panel",
              "name": "resultTable",
              "elements": [
                {
                  "type": "html",
                  "name": "decisionResult",
                  "html": `
                    <h5>Task Result</h5>
                    <br>
                    <p>
                      You have completed the <b>Decision Making Task</b>!
                    </p>
                    <p id="result-text">
                      Your bonus for this study is <b>$${totalScore}</b>.
                    </p>
                  `
                }, {
                  "type": "html",
                  "name": "decisionResult",
                  "html": `
                      <p>
                          Please click <b>"Next"</b> to answer the follow-up survey and complete this study.
                      </p>
                  `
                }
              ]
            }
          ]
        }, {
          "name": "page2",
          "elements": SoepSurvey,
        }, {
          "name": "page3",
          "elements": RiskSurvey,
        }, {
          "name": "page4",
          "elements": IdeologySurvey,
        }, {
          "name": "page5",
          "elements": AiLiteracySurvey,
        }, {
          "name": "page6",
          "elements": DeterminismSurvey,
        }, {
          "name": "page7",
          "elements": {
            "type": "panel",
            "name": "exitSurvey",
            "elements": [
              {
                "type": "html",
                "name": "exitSurveyInfo",
                "html": `<h5>Exit Survey</h5>
                <p>Please answer the following short survey before completing the study.</p>`
              }, {
                "type": "dropdown",
                "name": "education",
                "title": "What is the highest grade of school or year of college you completed?",
                "isRequired": false,
                "choices": [
                  "High school or less",
                  "Some college (1-3 years)",
                  "College graduate (Bachelors)",
                  "More than a Bachelor's degree",
                  "Other",
                  "Don't want to answer"
                ],
              }, {
                "type": "dropdown",
                "name": "salary",
                "title": "About how much wage and salary did you receive in the last year? It includes any type of income, such as a pension.",
                "isRequired": false,
                "choices": [
                  "Less than $20,000",
                  "$20,000 - $34,999",
                  "$35,000 - $49,999",
                  "$50,000 - $74,999",
                  "$75,000 - $99,999",
                  "Over $100,000",
                  "Don't want to answer"
                ],
              }, {
                "type": "comment",
                "name": "SuggestionUsage",
                'textUpdateMode': 'onTyping',
                "title": "How did the presence of the choice suggestion system influence your decision-making process?",
                "rows": 6
              }, {
                "type": "comment",
                "name": "reasonOfYourPrediction",
                'textUpdateMode': 'onTyping',
                "title": "Was there any part of these tasks that was confusing or unclear? We'd appreciate any feedback.",
                "rows": 6
              }
            ],
          }
        }
      ]
    }
  }

  const survey = new Model(surveyJson);
  survey.applyTheme(themeJson);
  survey.showCompleteButton = true;
  survey.setVariable("treatment", treatment);

  // Restore the survey state
  const storageItemKey = `survey_state_${player.id}_Exit`;

  // Save survey results to the local storage
  survey.onValueChanged.add(saveSurveyData);
  survey.onCurrentPageChanged.add(saveSurveyData);
  // Restore survey results
  const prevData = window.localStorage.getItem(storageItemKey) || null;
  if (prevData) {
    const data = JSON.parse(prevData);
    survey.data = data;
    if (data.pageNo) {
      survey.currentPageNo = data.pageNo;
    }
  }

  survey.onComplete.add((result) => {
    // if failed to assign a group
    if (player.get("dropoutReason") === "comprehension") {
      console.log('test');
        setTimeout(() => {
            window.location.href = `https://app.prolific.com/submissions/complete?cc=${PROLIFIC_CODE_COMPREHENSION}`; // Redirect to Prolific
        }, 1000); // To make sure the data is saved
    } else if (player.get('dropoutReason') === "completed") {
        // if all survey questions are answered
        if (!survey.isCurrentPageHasErrors) {
            for (let round = 1; round <= treatment.nRound; round++) {
                window.localStorage.removeItem(`decision-Main ${round}`);
            }
            window.localStorage.removeItem(storageItemKey);
            player.set('exitSurvey', result.data);
            setTimeout(() => {
                window.location.href = `https://app.prolific.com/submissions/complete?cc=${PROLIFIC_CODE}`; // Redirect to Prolific
            }, 1000); // To make sure the data is saved
        }
    }
    next();
  });

  return (
    <>
      <Survey model={survey} />
    </>
  )
}
