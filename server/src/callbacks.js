import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();
import { loadEnvironment } from './load.js';
import fs from 'fs';

loadEnvironment();
const DEPLOYMENT = process.env.DEPLOYMENT;
const PROLIFIC_CODE = process.env.PROLIFIC_CODE;
const PROLIFIC_CODE_COMPREHENSION = process.env.PROLIFIC_CODE_COMPREHENSION;
const PROLIFIC_CODE_ATTENTION = process.env.PROLIFIC_CODE_ATTENTION;
const PROLIFIC_CODE_NORESPONSE = process.env.PROLIFIC_CODE_NORESPONSE;
const PROLIFIC_CODE_NOGROUP = process.env.PROLIFIC_CODE_NOGROUP;

const gameConfig = JSON.parse(fs.readFileSync(process.env.EXPERIMENT_DIR + '/.empirica/gameConfig.json', { encoding: 'utf8' }));
const bonusConfig = gameConfig.find(config => config.type === 'bonus');
const taskConfig = gameConfig.find(config => config.type === 'task');
const AIPromptActive = fs.readFileSync(process.env.EXPERIMENT_DIR + '/.empirica/txt/promptActive.txt', { encoding: 'utf8' });

const timeLimits = {
  confirmation: (DEPLOYMENT === "prod") ? taskConfig.confirmationDuration : taskConfig.confirmationDurationDev,
  belief: (DEPLOYMENT === "prod") ? taskConfig.choiceDuration : taskConfig.choiceDurationDev,
  choice: (DEPLOYMENT === "prod") ? taskConfig.choiceDuration : taskConfig.choiceDurationDev,
  result: (DEPLOYMENT === "prod") ? taskConfig.resultDuration : taskConfig.resultDurationDev
};

Empirica.on("player", async (_, { player }) => {
  if (!player.get("participantID")) return;

  player.set("runMode", DEPLOYMENT);

  player.set("nComprehensionFailed", 0);
  player.set("failedQuestions", []);

  player.set("PROLIFIC_CODE", PROLIFIC_CODE);
  player.set("PROLIFIC_CODE_ATTENTION", PROLIFIC_CODE_ATTENTION);
  player.set("PROLIFIC_CODE_NOGROUP", PROLIFIC_CODE_NOGROUP);
  player.set("PROLIFIC_CODE_COMPREHENSION", PROLIFIC_CODE_COMPREHENSION);
  player.set("PROLIFIC_CODE_NORESPONSE", PROLIFIC_CODE_NORESPONSE);

  player.set("returnBonus", bonusConfig.returnBonus);
  player.set("newcombBoxAValue", bonusConfig.newcombBoxAValue);
  player.set("newcombBoxBValue", bonusConfig.newcombBoxBValue);
  // player.set("playerScore", 0);

  player.set("introStep", "Tutorial");
  player.set("introStepIndex", 0);
  player.set("introDone", false);

  let AIPrompt;
  AIPrompt = AIPromptActive;
  player.set("chatHistory-conversation", [
    {
      role: "system",
      content: AIPrompt
    }
  ]);
  player.set("pretask-survey", [
    { id: 1, choice: "" },
    { id: 2, choice: "" },
    { id: 3, choice: "" },
    { id: 4, choice: "" },
    { id: 5, choice: "" },
    { id: 6, choice: "" }
  ])
  player.set("expectation-survey", [
    { id: 1, choice: "" },
    { id: 2, choice: "" },
    { id: 3, choice: "" },
    { id: 4, choice: "" },
    { id: 5, choice: "" },
    { id: 6, choice: "" }
  ])
});

Empirica.onGameStart(({ game }) => {
  const treatment = game.get("treatment");
  for (let i = 0; i < treatment.nRound; i++) {
    const round = game.addRound({
      name: `Main ${i + 1}`,
      task: "main",
      round: i + 1,
    });
    round.addStage({ name: "choice", duration: timeLimits.choice });
    round.addStage({ name: "belief", duration: timeLimits.belief });
    round.addStage({ name: "result", duration: timeLimits.result });
  }
});

Empirica.onRoundStart(({ round }) => {
  const treatment = round.currentGame.get("treatment");
  const players = round.currentGame.players;
  for (const player of players) {
    player.round.set("decisionMade", false);
    player.round.set("decision", null);
    player.round.set("beliefMade", false);
    player.round.set("belief", null);
    player.round.set("rationalMade", false);
    player.round.set("rational", null);
    if (round.get("task") === "main") {
      player.set("introStep", "Decision Making Task");
      player.set("introStepIndex", 2);
    }
  }
});

Empirica.onStageStart(({ stage }) => { });

Empirica.onStageEnded(({ stage }) => {
  if (stage.get("name") !== "choice") return;

  const treatment = stage.currentGame.get("treatment");
  const players = stage.currentGame.players;

  for (const player of players) {
    const playerChoice = player.round.get("decision");
    const playerScore = (playerChoice === "1box") ? bonusConfig.newcombBoxBValue : bonusConfig.newcombBoxAValue + bonusConfig.newcombBoxBValue;
    player.round.set("playerScore", playerScore);

    const currentScore = player.get("playerScore") || 0;
    player.set("playerScore", playerScore + currentScore);

    (stage.round.get("name") === `Main ${treatment.nRound}`) ? player.set("dropoutReason", "completed") : null;
  }
});

Empirica.onRoundEnded(({ round }) => { });

Empirica.onGameEnded(({ game }) => {
  const treatment = game.get("treatment");
  const nRounds = treatment.nRound;
  const players = game.players;
  for (const player of players) {
    const totalScore = player.get("playerScore") || 0;
    player.set("bonus", totalScore);

    player.set("introStep", "Exit Survey");
    player.set("introStepIndex", 3);
  }
});