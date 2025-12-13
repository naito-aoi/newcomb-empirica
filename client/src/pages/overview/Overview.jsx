import {
  useGame,
  usePlayer
} from "@empirica/core/player/classic/react";
import React, { useEffect } from "react";

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';


export function Overview() {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }, []);

  const game = useGame();
  const treatment = game.get("treatment");
  const player = usePlayer();

  const stepsInteractive = [
    {
      label: 'Tutorial',
      description: '3 min',
    },
    {
      label: `${(treatment.allocatorType === 'generativeAI') ? 'Conversation with AI' : 'Pre-task survey'}`,
      description: '2 min',
    },
    {
      label: 'Decision making task',
      description: `5 min`,
    },
    {
      label: 'Exit survey',
      description: `5 min`,
    },
  ];
  const stepSimple = [
    {
      label: 'Tutorial',
      description: '3 min',
    }, {
      label: 'Decision making task',
      description: `5 min`,
    }, {
      label: 'Exit survey',
      description: `5 min`,
    },
  ];
  const steps = (treatment.isInteractive) ? stepsInteractive : stepSimple;

  const activeStep = player.get('introStepIndex');
  const introStep = player.get("introStep");

  return (
    <>
      <div className="bg-white h-full py-6 px-4 inset-shadow-md relative">
        <div className="mt-8 mx-4 font-medium text-lg text-sky-700">
          Overview
        </div>
        <Box sx={{ maxWidth: 400, mx: 2, mt: 2 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label} expanded>
                <StepLabel>
                  {step.label}
                </StepLabel>
                <StepContent>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.85rem',
                      color: 'gray',
                    }}
                  >
                    {step.description}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
        <div className="absolute bottom-4">
          <img
            src="/fig/cmu/cmu-wordmark-square-w-on-r.png"
            alt="Carnegie Mellon University"
            className="h-20 w-20 p-2 select-none"
            draggable="false"
            onDragStart={(e) => e.preventDefault()}
          />
        </div>
      </div>
    </>
  );
}
