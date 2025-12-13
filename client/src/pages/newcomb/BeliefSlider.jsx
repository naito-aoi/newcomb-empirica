import React, { useState } from "react";
import {
  useGame,
  usePlayer,
  useStage
} from "@empirica/core/player/classic/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Unplug } from '@/components/animate-ui/icons/unplug';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"

export function BeliefSlider() {
  const game = useGame();
  const treatment = game.get("treatment");
  const player = usePlayer();
  const playerAvatar = player.get("avatar");

  // const [value, setValue] = useState([50]);

  const stage = useStage();
  const stageName = stage.get("name");
  const belief = player.round.get("belief") || 0;
  const rational = player.round.get("rational") || "";

  const sliderChanged = (val) => {
    // setValue(val);
    player.round.set("belief", val[0]);
    player.round.set("beliefMade", true);
  }
  const radioQ2Changed = (val) => {
    player.round.set("rational", val);
    player.round.set("rationalMade", true);
  }

  if (stageName !== "belief") {
    return null;
  }

  // console.log(player.round.get("playerScore"));

  const yourChoice = (treatment.gameType === "PGG") ?
    (player.round.get("decision") === "Give" ? "Contribute" : player.round.get("decision")) :
    player.round.get("decision");

  // const currentRound = game.round.get("round");
  // const cumulativeScore = player.get("playerScore") || 0;
  // const averageScoreSoFar = parseFloat(cumulativeScore / currentRound).toFixed(2).replace(/\.?0+$/, '');

  const beliefSliderUI = (
    <>
      <div className="flex flex-col w-120 mt-8">
        <div className="bg-blue-50 p-4 mb-6 rounded-lg">
          <div className="flex gap-2 mb-3 text-sm font-medium">
            <div>Q1. </div>
            {/* <div>How much predictive ability do you think the {treatment.isAI ? "AI" : "wheel"} had for what you would choose?</div> */}
            <div>
              <div>
                Imagine playing this task 100 times, starting fresh each time.
              </div>
              <div className="mt-2">
                How many times do you think the {treatment.isAI ? `AI would correctly predict` : `the labels ("Two Boxes" / "One Box") drawn by the random generator will match`} your choice?
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 text-xs font-light text-neutral-500 pl-7">
            Please drag the slider below.
          </div>
        </div>
        <div className="flex flex-col gap-2 px-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="slider"><span className="text-red-500">*</span>The {treatment.isAI ? "AI would be correct" : "labels would match"}</Label>
            <span className="text-muted-foreground text-sm"><b className="text-lg text-blue-500">{belief}</b> out of 100 times</span>
          </div>
          <Slider
            id="slider"
            max={100}
            min={0}
            onValueChange={sliderChanged}
            step={1}
            value={[belief]}
            className="hover:cursor-pointer"
          />
          <div className="flex items-center justify-between text-muted-foreground text-xs tabular-nums">
            <div>
              <div className="w-30 text-left font-md text-sm">0</div>
              <div className="w-30 text-left text-xs text-neutral-400">Always {treatment.isAI ? "wrong" : "mismatched"}</div>
            </div>
            <div>
              <div className="w-30 text-center font-md text-sm">50</div>
              <div className="w-30 text-center text-xs text-neutral-400">Random</div>
            </div>
            <div>
              <div className="w-30 text-right font-md text-sm"> 100</div>
              <div className="w-30 text-right text-xs text-neutral-400">Always {treatment.isAI ? "correct" : "matched"}</div>
            </div>
            {/* <span className="w-30 text-right">100% (perfect predictive ability)</span> */}
          </div>
        </div>
        <div className="bg-blue-50 p-4 mt-8 mb-6 rounded-lg">
          <div className="flex gap-2 mb-3 text-sm font-medium">
            <div>Q2. </div>
            <div>In this task, which choice do you think is the more rational?</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 px-4 mb-8">
          <Label htmlFor="q2-radio" className="mb-2"><span className="text-red-500">*</span>Please select one option below:</Label>
          <RadioGroup
            id="q2-radio"
            value={rational || ""}
            onValueChange={val => radioQ2Changed(val)}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="2box" id="q2-2box" />
              <Label htmlFor="q2-2box" className="text-neutral-700">Taking both Box A and Box B</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="1box" id="q2-1box" />
              <Label htmlFor="q2-1box" className="text-neutral-700">Taking only Box B</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="unsure" id="q2-unsure" />
              <Label htmlFor="q2-unsure" className="text-neutral-700">Not sure</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </>
  );

  return beliefSliderUI;
}