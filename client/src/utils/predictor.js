// Wording for whoever/whatever sets the contents of Box B.
// exp1-3 treatments have no `predictorType` factor, so it is derived from `isAI`
// (AI vs. random generator). exp4 adds a human predictor ("another person") and
// "none": no prediction at all, Box B's contents are simply already determined.
const PREDICTORS = {
    AI: {
        a: "an AI",
        the: "the AI",
        The: "The AI",
        possessive: "the AI's",
        title: "AI",
        pronounPoss: "its",
        imageKey: "ai",
    },
    human: {
        a: "another person",
        the: "the person",
        The: "The person",
        possessive: "the person's",
        title: "Another Person",
        pronounPoss: "their",
        imageKey: "human",
    },
    none: {
        a: "",
        the: "",
        The: "",
        possessive: "",
        title: "",
        pronounPoss: "",
        imageKey: "",
    },
    random: {
        a: "a random generator",
        the: "the random generator",
        The: "The random generator",
        possessive: "the random generator's",
        title: "Random Generator",
        pronounPoss: "its",
        imageKey: "label",
    },
};

export function getPredictor(treatment) {
    const type = treatment?.predictorType || (treatment?.isAI ? "AI" : "random");
    return {
        type,
        // true when Box B is set by a prediction (AI or human) rather than a random draw
        isPredictor: type === "AI" || type === "human",
        // true when nobody/nothing is described as setting Box B (exp4 "No prediction")
        isNone: type === "none",
        // true when Box B follows the fixed `aiPrediction` factor instead of a random draw
        usesFixedContents: type !== "random",
        ...(PREDICTORS[type] || PREDICTORS.random),
    };
}
