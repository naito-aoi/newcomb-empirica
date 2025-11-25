const riskQuestions = [
  {
    name: "risk_1",
    title: "Betting a day’s income at the horse races.",
  }, {
    name: "risk_2",
    title: "Investing 10% of your annual income in a moderate growth mutual fund.",
  }, {
    name: "risk_3",
    title: "Betting a day’s income at a high-stake poker game.",
  }, {
    name: "risk_4",
    title: "Investing 5% of your annual income in a very speculative stock.",
  }, {
    name: "risk_5",
    title: "Betting a day’s income on the outcome of a sporting event.",
  }, {
    name: "risk_6",
    title: "Investing 10% of your annual income in a new business venture.",
  }
];

export function createRiskSurvey(questions) {
  // 最初の説明パネル
  const introPanel = {
    type: "panel",
    name: "panel",
    elements: [
      {
        type: "html",
        name: "instText",
        html: `
          <h5>
              Exit Survey
          </h5>
          <br>
          <p>
              For each of the following statements, please indicate the likelihood that you would engage in the described activity or behavior if you were to find yourself in that situation.
          </p>
        `,
      },
    ],
  };

  // 各設問パネル
  const questionPanels = questions.map((q) => ({
    type: "panel",
    name: "panel",
    elements: [
      {
        type: "rating",
        isRequired: true,
        rateType: "labels",
        rateMin: 1,
        rateMax: 7,
        minRateDescription: "Extremely unlikely",
        maxRateDescription: "Extremely likely",
        displayMode: "buttons",
        widthMode: "static",
        name: q.name,
        title: q.title,
      },
    ],
  }));

  return [introPanel, ...questionPanels];
}

// 動的に生成したSurvey
export const RiskSurvey = createRiskSurvey(riskQuestions);


export const IdeologySurvey = [
  {
    "type": "panel",
    "name": "panel",
    "elements": [
      {
        "type": "html",
        "name": "instText",
        "html": `
          <h5>
              Exit Survey
          </h5>
          <br>
          <p>
              People often describe their general political views as more "liberal" or more "conservative". In this survey:
          </p>
          <ol>
              <li><b>Liberal</b> refers to supporting social change and more open, progressive social values.</li>
              <li><b>Conservative</b> refers to favoring stability, continuity, and more traditional social values.</li>
          </ol>
        `
      }
    ]
  }, {
    "type": "panel",
    "name": "panel",
    "elements": [
      {
        "type": "rating",
        "isRequired": false,
        "rateType": "labels",
        "rateMin": 1,
        "rateMax": 7,
        "minRateDescription": "Liberal",
        "maxRateDescription": "Conservative",
        "displayMode": "buttons",
        "widthMode": "static",
        "name": "ideology",
        "title": "Where would you place yourself?",
        "description": "If you are unsure or prefer not to answer, you can skip this question.",
      }
    ],
    "showQuestionNumbers": "off",
  }
]


export const SoepSurvey = [
  {
    "type": "panel",
    "name": "panel",
    "elements": [
      {
        "type": "html",
        "name": "instText",
        "html": `
          <h5>
              Exit Survey
          </h5>
          <br>
          <p>
              For each statement below, choose a number from 1 to 7 to indicate how much you agree or disagree.
          </p>
        `
      }
    ]
  }, {
    "type": "panel",
    "name": "panel",
    "elements": [
      {
        "type": "rating",
        "isRequired": true,
        "rateType": "labels",
        "rateMin": 1,
        "rateMax": 7,
        "displayMode": "buttons",
        "widthMode": "static",
        "name": "soep",
        "title": "Are you generally a person who is fully prepared to take risks or do you try to avoid taking risks?",
        "description": "1 = try to avoid taking risks, 7 = fully prepared to take risks.",
      }
    ],
    "showQuestionNumbers": "off",
  }
]


const determinismQuestions = [
  {
    name: "fad_1",
    title: "I believe that the future has already been determined by fate.",
  }, {
    name: "fad_2",
    title: "People’s biological makeup determines their talents and personality.",
  }, {
    name: "fad_3",
    title: "Chance events seem to be the major cause of human history.",
  }, {
    name: "fad_4",
    title: "People have complete control over the decisions they make.",
  }, {
    name: "fad_5",
    title: "No matter how hard you try, you can’t change your destiny.",
  }, {
    name: "fad_6",
    title: "Psychologists and psychiatrists will eventually figure out all human behavior.",
  }, {
    name: "fad_7",
    title: "No one can predict what will happen in this world.",
  }, {
    name: "fad_8",
    title: "People must take full responsibility for any bad choices they make.",
  }, {
    name: "fad_9",
    title: "Fate already has a plan for everyone.",
  }, {
    name: "fad_10",
    title: "Your genes determine your future.",
  }, {
    name: "fad_11",
    title: "Life seems unpredictable—just like throwing dice or flipping a coin.",
  }, {
    name: "fad_12",
    title: "People can overcome any obstacles if they truly want to.",
  }, {
    name: "fad_13",
    title: "Whatever will be, will be—there’s not much you can do about it.",
  }, {
    name: "fad_14",
    title: "Science has shown how your past environment created your current intelligence and personality.",
  }, {
    name: "fad_15",
    title: "People are unpredictable.",
  }, {
    name: "fad_16",
    title: "Criminals are totally responsible for the bad things they do.",
  }, {
    name: "fad_17",
    title: "Whether people like it or not, mysterious forces seem to move their lives.",
  }, {
    name: "fad_18",
    title: "As with other animals, human behavior always follows the laws of nature.",
  }, {
    name: "fad_19",
    title: "Life is hard to predict because it is almost totally random.",
  }, {
    name: "fad_20",
    title: "Luck plays a big role in people’s lives.",
  }, {
    name: "fad_21",
    title: "People have complete free will.",
  }, {
    name: "fad_22",
    title: "Parents’ character will determine the character of their children.",
  }, {
    name: "fad_23",
    title: "People are always at fault for their bad behavior.",
  }, {
    name: "fad_24",
    title: "Childhood environment will determine your success as an adult.",
  }, {
    name: "fad_25",
    title: "What happens to people is a matter of chance.",
  }, {
    name: "fad_26",
    title: "Strength of mind can always overcome the body’s desires.",
  }, {
    name: "fad_27",
    title: "People’s futures cannot be predicted.",
  }
];

export function createDeterminismSurvey(questions) {
  // 最初の説明パネル
  const introPanel = {
    type: "panel",
    name: "panel",
    elements: [
      {
        type: "html",
        name: "instText",
        html: `
          <h5>
              Exit Survey
          </h5>
          <br>
          <p>
              For each statement below, choose a number from 1 to 7 to indicate how much you agree or disagree.
          </p>
        `,
      },
    ],
  };

  // 各設問パネル
  const questionPanels = questions.map((q) => ({
    type: "panel",
    name: "panel",
    elements: [
      {
        type: "rating",
        isRequired: true,
        rateType: "labels",
        rateMin: 1,
        rateMax: 7,
        minRateDescription: "Strongly disagree",
        maxRateDescription: "Strongly agree",
        displayMode: "buttons",
        widthMode: "static",
        name: q.name,
        title: q.title,
      },
    ],
  }));

  return [introPanel, ...questionPanels];
}

// 動的に生成したSurvey
export const DeterminismSurvey = createDeterminismSurvey(determinismQuestions);


const aiLiteracyQuestions = [
  {
    name: "ails_2",
    title: "I do not know how AI technology can help me.",
  }, {
    name: "ails_3",
    title: "I can identify the AI technology employed in the applications and products I use.",
  }, {
    name: "ails_4",
    title: "I can skilfully use AI applications or products to help me with my daily work.",
  }, {
    name: "ails_5",
    title: "It is usually hard for me to learn to use a new AI application or product.",
  }, {
    name: "ails_6",
    title: "I can use AI applications or products to improve my work efficiency.",
  }, {
    name: "ails_7",
    title: "I can evaluate the capabilities and limitations of an AI application or product after using it for a while.",
  }, {
    name: "ails_8",
    title: "I can choose a proper solution from various solutions provided by a smart agent.",
  }, {
    name: "ails_9",
    title: "I can choose the most appropriate AI application or product from a variety for a particular task.",
  }, {
    name: "ails_10",
    title: "I always comply with ethical principles when using AI applications or products.",
  }, {
    name: "ails_11",
    title: "I am never alert to privacy and information security issues when using AI applications or products.",
  }, {
    name: "ails_12",
    title: "I am always alert to the abuse of AI technology.",
  }, {
    name: "bap_1",
    title: "AI systems can predict human behavior with high accuracy.",
  }, {
    name: "bap_2",
    title: "AI cannot accurately predict my actions.",
  }, {
    name: "bap_3",
    title: "The use of AI helps us predict the future.",
  }
];

export function createAiLiteracySurvey(questions) {
  // 最初の説明パネル
  const introPanel = {
    type: "panel",
    name: "panel",
    elements: [
      {
        type: "html",
        name: "instText",
        html: `
          <h5>
              Exit Survey
          </h5>
          <br>
          <p>
              For each statement below, choose a number from 1 to 7 to indicate how much you agree or disagree.
          </p>
        `,
      },
    ],
  };

  // 各設問パネル
  const questionPanels = questions.map((q) => ({
    type: "panel",
    name: "panel",
    elements: [
      {
        type: "rating",
        isRequired: true,
        rateType: "labels",
        rateMin: 1,
        rateMax: 7,
        minRateDescription: "Strongly disagree",
        maxRateDescription: "Strongly agree",
        displayMode: "buttons",
        widthMode: "static",
        name: q.name,
        title: q.title,
      },
    ],
  }));

  return [introPanel, ...questionPanels];
}

// 動的に生成したSurvey
export const AiLiteracySurvey = createAiLiteracySurvey(aiLiteracyQuestions);