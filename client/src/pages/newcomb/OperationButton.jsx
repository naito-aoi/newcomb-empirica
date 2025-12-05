import { Button } from "@/components/animate-ui/components/buttons/button";
import {
    usePlayer,
    useStage
} from "@empirica/core/player/classic/react";
import React from "react";

export function OperationButton() {
    const player = usePlayer();
    const stage = useStage();

    const pdStep = player.round.get("pdStep") || "instruction"; // "instruction"; "message"; "decision"; "finished"

    const stageName = stage.get("name");
    const buttonShown = !stageName || pdStep === "finished";
    const beliefFilled = stageName === "belief" && player.round.get("beliefMade") && player.round.get("rationalMade");

    const checkCanProceed = () => {
        if (!stageName) return false;

        switch (stageName) {
            case "choice":
                // decision に値が入っているかチェック
                // (空文字、null, undefined でなければOK)
                const decision = player.round.get("decision");
                return decision !== undefined && decision !== null && decision !== "";

            case "belief":
                // 2つの入力（スライダーとラジオボタン）が完了しているかチェック
                // ※入力コンポーネント側で set("beliefMade", true) している前提
                const beliefMade = player.round.get("beliefMade");
                const rationalMade = player.round.get("rationalMade");
                return beliefMade && rationalMade;

            case "result":
            case "instruction":
                // 結果画面や説明画面は、最初からボタンを表示してOK
                // (必要ならタイマー終了フラグなどをここに加える)
                return true;

            default:
                // 未定義のステージならとりあえず表示（あるいは非表示）
                return true;
        }
    };

    const canProceed = checkCanProceed();
    const buttonText = (stageName === "choice") ? "Confirm" : "Next";

    return (
        <>
            <div className="relative flex items-center justify-center mx-auto">
                {canProceed && (
                    <>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-10 w-32 rounded-md bg-sky-500 animate-ping"></div>
                        </div>
                        <Button
                            size="icon"
                            className="relative h-12 w-50 bg-sky-500 hover:bg-sky-700 transition duration-150 shadow-lg text-lg text-white rounded-lg mx-auto"
                            onClick={() => {
                                player.round.set("pdStep", "waiting");
                                player.stage.set("submit", true);
                            }}
                        >
                            {buttonText}
                        </Button>
                    </>
                )}
            </div>
        </>
    );
}