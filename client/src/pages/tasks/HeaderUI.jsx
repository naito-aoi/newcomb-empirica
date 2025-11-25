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
    const pdEndowment = player.get('pdEndowment');
    const pdMultiplier = player.get('pdMultiplier');


    const choiceUI = (
        <>
            <div className="text-xl">Point Management Game</div>
            <div className="bg-white mt-2 mr-2">
                <div className="text-sm font-light">
                    Now, a new round begins! Everyone has {pdEndowment}pt.
                </div>
                <div id="custom" className="mt-2 text-sm font-light">
                    Each of you will choose one of two options:
                    <ol className="list-disc list-outside">
                        <li><span id="two-boxer">Keep</span> the {pdEndowment}pt for yourself.</li>
                        <li><span id="one-boxer">{(treatment.gameType === "PD") ? "Give" : "Contribute"}</span> the {pdEndowment}pt to {(treatment.gameType === "PD") ? "your partner" : "the common pool"}.
                            ({(treatment.gameType === "PD") ? `The ${pdEndowment}pt` : "The pooled points"} will be tripled, and {(treatment.gameType === "PD") ? `your partner will receive ${pdEndowment * pdMultiplier}pt` : "equally distributed among all members"}.)</li>
                    </ol>
                </div>
            </div>
        </>
    );
    const resultUI = (
        <>
            <div className="text-xl">Result</div>
            <div className="bg-white mt-2 mr-2">
                <div className="text-sm font-light">
                    You and {(treatment.gameType === "PD") ? "your partner" : "your group members"} have made a decision in this round!
                </div>
            </div>
        </>
    );
    const ui = (stageName === "choice") ? choiceUI : resultUI;

    return (
        <>
            {ui}
        </>
    );
}