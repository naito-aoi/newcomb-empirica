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
  const beliefMade = player.round.get("beliefMade");
  const belief = player.round.get("belief") || 50;
  const rationalMade = player.round.get("rationalMade");
  const rational = player.round.get("rational") || "";

  const sliderChanged = (val) => {
    // setValue(val);
    player.round.set("belief", val[0]);
    player.round.set("beliefMade", true);
  }
  const raditoChanged = (val) => {
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
            <div>How accurate do you think the {treatment.isAI ? "AI" : ""} at predicting your choice?</div>
          </div>
          <div className="flex flex-col items-center gap-2 text-sm font-light text-neutral-500 pl-8">
            If you think the prediction was completely random, that corresponds to 0% accuracy.
            If you think the prediction was perfect, that corresponds to 100% accuracy.
          </div>
        </div>
        <div className="flex flex-col gap-2 px-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="slider">Please drag the slider below<span className="text-red-500">*</span>: </Label>
            <span className="text-muted-foreground text-sm"><b className="text-blue-500">{belief}</b>%</span>
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
            <span className="w-6 text-center">0%</span>
            <span className="w-6 text-right">100%</span>
          </div>
        </div>
        <div className="bg-blue-50 p-4 mt-8 mb-6 rounded-lg">
          <div className="flex gap-2 mb-3 text-sm font-medium">
            <div>Q2. </div>
            <div>In this task, which choice do you think was the more rational one?</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 px-4 mb-8">
          <Label htmlFor="q2-radio" className="mb-2">Please select one option below<span className="text-red-500">*</span>:</Label>
          <RadioGroup
            id="q2-radio"
            value={rational || ""}
            onValueChange={val => raditoChanged(val)}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="always" id="q2-always" />
              <Label htmlFor="q2-always">Taking both Box A and Box B</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="mostly" id="q2-mostly" />
              <Label htmlFor="q2-mostly">Taking only Box B</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="half" id="q2-half" />
              <Label htmlFor="q2-half">Not sure</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </>
  );

  return beliefSliderUI;
}