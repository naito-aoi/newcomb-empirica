import {
    useGame,
    useStage,
    usePlayer
} from "@empirica/core/player/classic/react";

export function HeaderUI() {
    const game = useGame();
    const treatment = game.get("treatment");
    const stage = useStage();
    const player = usePlayer();
    const stageName = stage.get("name");
    const newcombBoxAValue = player.get("newcombBoxAValue");
    const newcombBoxBValue = player.get("newcombBoxBValue");

    const playerChoice = player.round.get("decision");
    const predictedChoice = (treatment.isAI) ? "1box" : player.round.get("drawnLabel");
    const contentsOfBoxB = (predictedChoice === "1box") ? newcombBoxBValue : 0;


    const choiceUI = (
        <>
            <div className="text-xl">Decision Making Task</div>
            <div className="mr-2">
                <div id="custom" className="text-sm font-light">
                    <ol className="list-disc list-outside">
                        <li>
                            <b>${newcombBoxAValue}</b> is guaranteed in <b>Box A</b> if opened.
                            The contents of <b>Box B</b> are either <b>$0</b> or <b>${newcombBoxBValue}</b>.
                        </li>
                        <li>
                            If {(treatment.isAI) ? <> <span id="ai-avatar">the AI</span> predicts that you will <span id="two-boxer">open both boxes</span></> : <><span id="ai-avatar">the random generator</span> draws "<span id="two-boxer">Two Boxes</span>" label</>}, the contents of Box B is set to <b>$0</b>.
                            If {(treatment.isAI) ? <><span id="ai-avatar">the AI</span> predicts that you will <span id="one-boxer">open only Box B</span></> : <><span id="ai-avatar">the random generator</span> draws "<span id="one-boxer">One Box</span>" label</>}, the contents of Box B is set to <b>${newcombBoxBValue}</b>.
                        </li>
                    </ol>
                </div>
            </div>
        </>
    );
    const beliefUI = (
        <>
            <div className="text-xl">Decision Making Task</div>
            <div className="mr-2 mt-4">
                <div className="text-sm font-light">
                    Please answer the questions below.
                </div>
            </div>
        </>
    );
    const resultUI = (
        <>
            <div className="text-xl">Result</div>
            <div className="mr-2 mt-4">
                <div className="text-sm font-light">
                    {(treatment.isAI) ? <><span id="ai-avatar">The AI</span> predicted that you would choose to</> : <><span id="ai-avatar">The random generator</span> drew</>}
                </div>
                <div className="font-light text-sm">
                    <span id={`${(predictedChoice === "1box") ? "one-boxer" : "two-boxer"}`}>
                        {(predictedChoice === "1box") ? "One Box" : "Two Boxes"} &nbsp;
                    </span>
                    <span>
                        and set Box B to contain <b>${contentsOfBoxB}</b>.
                    </span>
                </div>
            </div>
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