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
    const buttonText = (stageName === "choice") ? "Confirm" : "Next round";

    return (
        <>
            <div className="relative flex items-center justify-center mx-auto">
                {buttonShown && (
                    <>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-10 w-32 rounded-md bg-sky-500 animate-ping"></div>
                        </div>
                        <Button 
                            size="icon"
                            className="relative h-12 w-50 bg-sky-500 hover:bg-sky-700 transition duration-150 shadow-lg text-lg rounded-lg mx-auto"
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