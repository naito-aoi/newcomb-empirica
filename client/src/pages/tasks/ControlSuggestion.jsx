import React, { useEffect } from "react";
import {
    useStage,
    usePlayer
} from "@empirica/core/player/classic/react";
import { DecisionButton } from "./DecisionButton.jsx";

export function ControlSuggestion() {
    const player = usePlayer();
    const stage = useStage();

    if (stage.get("name") === "result") {
        return null;
    }

    useEffect(() => {
        player.round.set("pdStep", "decision");
    }, []);

    return (
        <>
            <div className="my-auto">
            <DecisionButton />
            </div>
        </>
    )
}