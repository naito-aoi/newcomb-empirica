import {
    useGame,
    useRound,
    useStage,
    usePlayer
} from "@empirica/core/player/classic/react";
import { getPredictor } from "@/utils/predictor.js";

export function HeaderUI() {
    const game = useGame();
    const treatment = game.get("treatment");
    const p = getPredictor(treatment);
    // exp4 treatments are the only ones that set the `predictorType` factor
    const isExp4 = !!treatment.predictorType;
    const round = useRound();
    const stage = useStage();
    const player = usePlayer();
    const stageName = stage.get("name");
    const newcombBoxAValue = player.get("newcombBoxAValue");
    const newcombBoxBValue = player.get("newcombBoxBValue");

    const playerChoice = player.round.get("decision");
    const predictedChoice = (p.usesFixedContents) ? treatment.aiPrediction : player.round.get("drawnLabel");
    const contentsOfBoxB = (predictedChoice === "1box") ? newcombBoxBValue : 0;


    const taskTitle = (isExp4) ? "Decision-Making Survey" : "Decision Making Task";
    const roundSuffix = (treatment.nRound > 1) ? `: Round ${round.get('round')}` : "";

    // exp4: adds an item saying that the predictor predicts the participant's choice
    // before the decision (plus the reliability statement).
    const exp4ChoiceItems = (
        <>
            <li>
                <b>${newcombBoxAValue}</b> is guaranteed in <b>Box A</b> if opened.
                The contents of <b>Box B</b> are either <b>$0</b> or <b>${newcombBoxBValue}</b>.
            </li>
            {p.isNone ?
                <li>
                    The contents of Box B have <b>already been determined</b>.
                </li>
                :
                <>
                    <li>
                        Before you decide, <span id="ai-avatar">{(p.type === "AI") ? "an AI system" : "another person"}</span> predicts your choice.
                        {treatment.reliability === "reliable" &&
                            <b> <span id="ai-avatar">{(p.type === "AI") ? "The AI system" : "This person"}</span> has been trained to predict people's choices in this task and has correctly predicted 98 out of 100 previous participants' choices.</b>
                        }
                    </li>
                    <li>
                        If <span id="ai-avatar">{p.the}</span> predicts that you will <span id="two-boxer">open both boxes</span>, the contents of Box B is set to <b>$0</b>.
                        {" "}If <span id="ai-avatar">{p.the}</span> predicts that you will <span id="one-boxer">open only Box B</span>, the contents of Box B is set to <b>${newcombBoxBValue}</b>.
                    </li>
                </>
            }
        </>
    );

    const choiceUI = (
        <>
            <div className="text-xl">{taskTitle}{roundSuffix}</div>
            <div className="mr-2">
                <div id="custom" className="text-sm font-light">
                    <ol className="list-disc list-outside">
                        {isExp4 ? exp4ChoiceItems : <>
                            <li>
                                <b>${newcombBoxAValue}</b> is guaranteed in <b>Box A</b> if opened.
                                The contents of <b>Box B</b> are either <b>$0</b> or <b>${newcombBoxBValue}</b>.
                            </li>
                            <li>
                                If {(p.isPredictor) ? <> <span id="ai-avatar">{p.the}</span> predicts that you will <span id="two-boxer">open both boxes</span></> : <><span id="ai-avatar">the random generator</span> draws "<span id="two-boxer">Two Boxes</span>" label</>}, the contents of Box B is set to <b>$0</b>.
                                If {(p.isPredictor) ? <><span id="ai-avatar">{p.the}</span> predicts that you will <span id="one-boxer">open only Box B</span></> : <><span id="ai-avatar">the random generator</span> draws "<span id="one-boxer">One Box</span>" label</>}, the contents of Box B is set to <b>${newcombBoxBValue}</b>.
                            </li>
                        </>}
                    </ol>
                </div>
            </div>
        </>
    );
    const beliefUI = (
        <>
            <div className="text-xl">{taskTitle}{roundSuffix}</div>
            <div className="mr-2 mt-4">
                <div className="text-sm font-light">
                    Please answer the questions below.
                </div>
            </div>
        </>
    );
    const resultUI = (
        <>
            <div className="text-xl">Result{(treatment.nRound > 1) ? `: Round ${round.get('round')}` : ""}</div>
            {p.isNone ?
                <div className="mr-2 mt-4">
                    <div className="text-sm font-light">
                        Box B had been set to contain <b>${contentsOfBoxB}</b>.
                    </div>
                </div>
                :
                <div className="mr-2 mt-4">
                    <div className="text-sm font-light">
                        {(p.isPredictor) ? <><span id="ai-avatar">{p.The}</span> predicted that you would choose to</> : <><span id="ai-avatar">The random generator</span> drew</>}
                    </div>
                    <div className="font-light text-sm">
                        <span id={`${(predictedChoice === "1box") ? "one-boxer" : "two-boxer"}`}>
                            {(predictedChoice === "1box") ? "One Box" : "Two Boxes"} &nbsp;
                        </span>
                        <span>
                            and set Box B to contain <b>${contentsOfBoxB}</b> {(treatment.nRound > 1) ? "in this round" : ""} .
                        </span>
                    </div>
                </div>
            }
        </>
    );
    // const ui = (stageName === "choice") ? choiceUI : resultUI;
    const ui = (stageName === "choice") ? choiceUI : (stageName === "belief") ? beliefUI : resultUI;

    return (
        <>
            {ui}
        </>
    );
}