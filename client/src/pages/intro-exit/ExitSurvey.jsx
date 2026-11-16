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
import { getPredictor } from "@/utils/predictor.js";

export function ExitSurvey({ next }) {
  const game = useGame();
  const treatment = game?.get("treatment");
  const p = getPredictor(treatment);
  const isHypothetical = !!treatment.isHypothetical;
  const player = usePlayer();
  const totalScore = player.get("playerScore") || 0;
  // Hypothetical treatments (exp4): the box contents are never paid out.
  const paidBonus = isHypothetical ? 0 : (Math.ceil((player.get("playerScore") / treatment.nRound) * 10) / 10 || 0);
  player.set("paidBonus", paidBonus);
  const PROLIFIC_CODE = player.get('PROLIFIC_CODE');
  const PROLIFIC_CODE_COMPREHENSION = player.get('PROLIFIC_CODE_COMPREHENSION');

  const choiceEqualRational = player.get("choiceEqualRational");

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
              ${isHypothetical
                      ? `As explained in the tutorial, this task was <b>hypothetical</b>: the money in the boxes will <b>not actually be paid</b>. Your payment for this study does not depend on your choice.`
                      : `Your ${(treatment.nRound) > 1 ? "average bonus" : "bonus"} for this study is <b>$${paidBonus}</b>, which will be paid separately within a few days.`}
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
          "visibleIf": "{treatment.nRound} = 1"
        }, {
          "name": "page3",
          "elements": RiskSurvey,
          "visibleIf": "{treatment.nRound} = 1"
        }, {
          "name": "page4",
          "elements": IdeologySurvey,
          "visibleIf": "{treatment.nRound} = 1"
        }, {
          "name": "page5",
          "elements": AiLiteracySurvey,
          "visibleIf": "{treatment.nRound} = 1"
        }, {
          "name": "page6",
          "elements": DeterminismSurvey,
          "visibleIf": "{treatment.nRound} = 1"
        }, {
          "name": "page7",
          "elements": {
            "type": "panel",
            "name": "exitSurvey",
            "elements": [
              {
                "type": "html",
                "name": "exitSurveyInfo",
                "html": `<h5>Exit Survey</h5>`
              }, {
                "type": "radiogroup",
                "name": "gender",
                "title": "What is your gender identity?",
                "isRequired": true,
                "colCount": 2,
                "choices": [
                  "Female",
                  "Male",
                  "Non-binary",
                  "Don't want to answer"
                ],
              }, {
                "type": "text",
                "name": "age",
                "title": "What is your age?",
                "inputType": "number",
                "isRequired": true,
                "min": 18,
                "max": 120,
                "validators": [{ "type": "numeric", "minValue": 18, "maxValue": 120, "text": "Please enter your age in years." }],
                // }, {
                //   "type": "comment",
                //   "name": "DecisionProcess",
                //   'textUpdateMode': 'onTyping',
                //   "title": "Please tell us what you focused on and your decision-making process in this task.",
                //   "isRequired": true,
                //   "rows": 6
              },
              // exp4 (the only treatments with `predictorType`) with an AI / human predictor asks why the
              // participant expects the prediction to succeed or fail; everything else keeps the original question.
              (treatment.predictorType && p.isPredictor) ? {
                "type": "comment",
                "name": "PredictionReason",
                'textUpdateMode': 'onTyping',
                "title": `Do you think ${p.the} would succeed or fail in predicting your choice in this task? Please tell us why you think so.`,
                "isRequired": true,
                "rows": 6
              } : {
                "type": "comment",
                "name": "PredictionSystem",
                'textUpdateMode': 'onTyping',
                "title": (p.isNone) ? `How did the fact that the contents of Box B had already been determined influence your decision-making process?` : `How did the presence of ${p.type === "AI" ? "the AI prediction system" : p.type === "human" ? "the other person's prediction" : "the random generator"} influence your decision-making process?`,
                "isRequired": true,
                "rows": 6
              },
              // exp4 (the only treatments with `predictorType`), AI / human predictor only:
              // what the participant pictured as the predictor.
              ...((treatment.predictorType && p.isPredictor) ? [{
                "type": "comment",
                "name": "PredictorImage",
                'textUpdateMode': 'onTyping',
                "title": `What kind of ${p.type === "AI" ? "AI" : "person"} did you specifically imagine as ${p.the} ${p.type === "AI" ? "that" : "who"} predicted your decision in the task? If possible, please tell us any specific names or characteristics.`,
                "isRequired": true,
                "rows": 6
              }] : []),
              // exp4 (all conditions): which predictor the participant would pick if given the choice.
              ...((treatment.predictorType) ? [{
                "type": "radiogroup",
                "name": "PreferredPredictor",
                "title": "In this task, if you could choose either another person or an AI as the predictor who determines the contents of Box B, which would you prefer?",
                "isRequired": true,
                "choicesOrder": "random",
                "choices": [
                  { "value": "human", "text": "Another person" },
                  { "value": "AI", "text": "An AI" }
                ],
              }] : []),
              {
                "type": "comment",
                "name": "choiceIsNotRational",
                'textUpdateMode': 'onTyping',
                "title": `Your actual choices and the choices you consider rational do not seem to match. Please tell us why.`,
                "isRequired": true,
                "rows": 6,
                "visibleIf": "{showChoiceIsNotRational}"
              }, {
                "type": "comment",
                "name": "Confusion",
                'textUpdateMode': 'onTyping',
                "title": "Was there any part of these tasks that was confusing or unclear? We'd appreciate any feedback. (Optional)",
                // "isRequired": true,
                "rows": 6
              }
            ],
          }
        }
      ]
    }
  }

  // exp4: no feedback at all, so skip the "Task Result" page and go straight to the survey.
  if (treatment.skipResult && surveyJson.pages) {
    surveyJson.pages = surveyJson.pages.filter((page) => page.name !== "page1");
  }
  // exp4: leave out the trait surveys (SOEP, risk, ideology, determinism);
  // only the AI literacy scale (page5) and the questions on the last page remain.
  if (treatment.skipTraitSurveys && surveyJson.pages) {
    const traitPages = ["page2", "page3", "page4", "page6"];
    surveyJson.pages = surveyJson.pages.filter((page) => !traitPages.includes(page.name));
  }

  const survey = new Model(surveyJson);
  survey.applyTheme(themeJson);
  survey.showCompleteButton = true;
  survey.setVariable("treatment", treatment);
  // exp4 (the only treatments with `predictorType`) does not ask which choice is rational,
  // so there is no mismatch to explain there.
  survey.setVariable("showChoiceIsNotRational", !treatment.predictorType && !choiceEqualRational);
  // The survey pages are only visible once `treatment` is set above. Without the always-visible
  // "Task Result" page, the model initially lands on the last page, so go back to the first one.
  survey.currentPageNo = 0;

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
