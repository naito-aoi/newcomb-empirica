import { useState } from "react"
import {
    useGame,
    usePlayer
} from "@empirica/core/player/classic/react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function DecisionButton() {
    const game = useGame();
    const treatment = game.get("treatment");
    const player = usePlayer();
    const pdStep = player.round.get("pdStep") || "instruction";
    // decisionはlocal storageに保存
    const [decision, setDecision] = useState(player.get("decision") || "");

    const options =  [
        { value: "2box", label: "Open both boxes", imgSrc: "/fig/Newcomb/Newcomb-system-2box.png" },
        { value: "1box", label: "Open only Box B", imgSrc: "/fig/Newcomb/Newcomb-system-1box.png" },
    ];

    // Newcomb のときは縦並び (flex-col)、それ以外は横並び (flex items-center)
    const optionClass = `w-70 border cursor-pointer rounded-md p-4 flex flex-col gap-2 shadow-lg [&:has(:checked)]:shadow-sm [&:not(:has(:checked))]:hover:bg-zinc-50 [&:has(:checked)]:bg-zinc-100 dark:[&:has(:checked)]:bg-zinc-800`;

    // プレイヤーの選択を保存
    function handleOptionChange(value) {
        player.round.set("pdStep", "finished");
        player.round.set("decisionMade", true);
        player.round.set("decision", value);
        setDecision(value);
    }

    return (
        (pdStep === 'decision' || pdStep === 'finished') ? (
            <form className="h-50 space-y-4 mt-auto mb-4">
                <RadioGroup value={decision} onValueChange={handleOptionChange} id="ai-conversation" className="flex items-start gap-4">
                    <Label
                        htmlFor={`${options[0].value}`}
                        className={optionClass}
                    >
                        <div className="flex items-center gap-2 text-lg font-semibold text-[#31cc31]">
                            <RadioGroupItem id={options[0].value} value={options[0].value} />
                            {options[0].label}
                        </div>
                        <img src={`${options[0].imgSrc}`} className="mx-auto h-28 mr-2" />
                    </Label>
                    <Label
                        htmlFor={options[1].value}
                        className={optionClass}
                    >
                        <div className="flex items-center gap-2 text-lg font-semibold text-[#9e3dff]">
                            <RadioGroupItem id={options[1].value} value={options[1].value} />
                            {options[1].label}
                        </div>
                        <img src={`${options[1].imgSrc}`} className="mx-auto h-28 mr-2" />
                    </Label>
                </RadioGroup>

            </form>
        ) : null
    );
}