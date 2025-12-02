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


    const choiceUI = (
        <>
            <div className="text-xl">Decision Making Task</div>
            <div className="mr-2">
                <div id="custom" className="text-sm font-light">
                    <ol className="list-disc list-outside">
                        <li>
                            <b>Box A</b> is transparent, and <b>${newcombBoxAValue}</b> is guaranteed if opened.
                            <b> Box B</b> is opaque, and the content inside is either <b>$0</b> or <b>${newcombBoxBValue}</b>.
                        </li>
                        <li>
                            If {(treatment.isAI) ? <><span id="ai-avatar">the AI</span> predicts</> : <><span id="ai-avatar">the wheel</span> indicates</>} that you will <span id="one-boxer">open only Box B</span>, it should have placed <b>${newcombBoxBValue}</b> in Box B.
                            If {(treatment.isAI) ? <><span id="ai-avatar">the AI</span> predicts</> : <><span id="ai-avatar">the wheel</span> indicates</>} that you will <span id="two-boxer">open both boxes</span>, it should have placed <b>$0</b> in Box B.
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
                    Please answer the questions about the choice you have made.
                </div>
            </div>
        </>
    );
    const resultUI = (
        <>
            <div className="text-xl">Result</div>
            <div className="mr-2 mt-4">
                <div className="text-sm font-light">
                    {(treatment.isAI) ? <><span id="ai-avatar">The AI</span> predicted</> : <><span id="ai-avatar">The wheel</span> indicated</>} that you would choose to
                </div>
                <div className="font-light text-sm">
                    <span id="one-boxer">
                        open only Box B &nbsp;
                    </span>
                    <span>
                        and set Box B to contain <b>${newcombBoxBValue}</b>.
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