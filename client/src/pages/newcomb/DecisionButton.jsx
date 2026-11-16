import { useState } from "react"
import {
    useGame,
    usePlayer
} from "@empirica/core/player/classic/react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getPredictor } from "@/utils/predictor.js";

export function DecisionButton() {
    const game = useGame();
    const treatment = game.get("treatment");
    const p = getPredictor(treatment);
    const player = usePlayer();
    const pdStep = player.round.get("pdStep") || "instruction";
    // decisionはlocal storageに保存
    const [decision, setDecision] = useState(player.get("decision") || "");

    const newcombBoxAValue = player.get('newcombBoxAValue');
    const newcombBoxBValue = player.get('newcombBoxBValue');

    const boxBNote = (p.isNone) ? `$0 / $${newcombBoxBValue}`
        : (p.isPredictor) ? `$0 / $${newcombBoxBValue} set by ${p.type === "AI" ? "AI" : p.the}`
            : `a chance of $0 / $${newcombBoxBValue}`;

    const options = [
        { value: "2box", label: "Open both boxes", imgSrc: "/fig/Newcomb/Newcomb-system-2box.png" },
        { value: "1box", label: "Open Box B only", imgSrc: "/fig/Newcomb/Newcomb-system-1box.png" },
    ];

    // Newcomb のときは縦並び (flex-col)、それ以外は横並び (flex items-center)
    const optionClass = `w-70 border cursor-pointer rounded-md py-2 px-4 flex flex-col gap-2 shadow-lg [&:has(:checked)]:shadow-sm [&:not(:has(:checked))]:hover:bg-zinc-50 [&:has(:checked)]:bg-zinc-100 dark:[&:has(:checked)]:bg-zinc-800`;

    // プレイヤーの選択を保存
    function handleOptionChange(value) {
        player.round.set("pdStep", "finished");
        player.round.set("decisionMade", true);
        player.round.set("decision", value);
        setDecision(value);
    }

    return (
        (pdStep === 'decision' || pdStep === 'finished') ? (
            <form className="min-h-55 space-y-2 mt-auto mb-4">
                <div className="text-sm font-semibold text-center">
                    {/* exp4 (the only treatments with `predictorType`) is hypothetical: ask what they would choose */}
                    {(treatment.predictorType) ? "Which option would you choose?" : "Please make your decision by clicking one of the buttons below."}
                </div>
                <RadioGroup value={decision} onValueChange={handleOptionChange} id="ai-conversation" className="flex items-start gap-4">
                    <Label
                        htmlFor={`${options[0].value}`}
                        className={optionClass}
                    >
                        {/* <div className="flex items-center gap-2 text-lg font-semibold text-[#31cc31]">
                            <RadioGroupItem id={options[0].value} value={options[0].value} />
                            {options[0].label}
                        </div> */}
                        <div className="flex">
                            <RadioGroupItem id={options[0].value} value={options[0].value} className="mt-2" />
                            <div className="flex flex-col items-start justify-start ml-5">
                                <div className="text-lg font-semibold text-[#31cc31]">{options[0].label}</div>
                                {/* exp4: only the option label and the illustration are shown */}
                                {!treatment.predictorType && <div className="text-xs text-neutral-500">fixed ${newcombBoxAValue} + {boxBNote}</div>}
                            </div>
                        </div>
                        <img src={`${options[0].imgSrc}`} className="mx-auto h-28 mr-2" />
                    </Label>
                    <Label
                        htmlFor={options[1].value}
                        className={optionClass}
                    >
                        <div className="flex">
                            <RadioGroupItem id={options[1].value} value={options[1].value} className="mt-2" />
                            <div className="flex flex-col items-start justify-start ml-5">
                                <div className="text-lg font-semibold text-[#9e3dff]">{options[1].label}</div>
                                {!treatment.predictorType && <div className="text-xs text-neutral-500">{boxBNote}</div>}
                            </div>
                        </div>
                        <img src={`${options[1].imgSrc}`} className="mx-auto h-28 mr-2" />
                    </Label>
                </RadioGroup>

            </form>
        ) : null
    );
}