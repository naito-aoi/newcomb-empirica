import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  useGame,
  usePlayer
} from "@empirica/core/player/classic/react";
import React, { useState, useEffect } from "react";
import { Tutorial } from "./Tutorial.jsx";
import { Overview } from "../overview/Overview";
import { AIInteraction } from "../tasks/AIInteraction.jsx";
import { NonAIInteraction } from "../tasks/NonAIInteraction.jsx";
import { ExpectationSurvey } from "./ExpectationSurvey.jsx";

export function Introduction({ next }) {
  const game = useGame();
  const treatment = game.get("treatment");
  const player = usePlayer();
  const introStepIndex = player.get("introStepIndex");

  const [introDone, setIntroDone] = useState(player.get("introDone") || false);
  useEffect(() => {
    if (introDone) {
      next();
    }
  }, [introDone]);

  const [collapsed, setCollapsed] = useState(false);

  // console.log("introStepIndex", introStepIndex);

  let content;
  switch (introStepIndex) {
    case 1:
      //   content = (
      //     <div className="flex items-start max-h-250 justify-center h-full w-full p-8">
      //       <ExpectationSurvey />
      //     </div>
      //   );
      //   break;
      // case 2:
      content = (
        <div className="flex items-start max-h-250 justify-center h-full w-full p-8">
          {(treatment.allocatorType === 'generativeAI') ? <AIInteraction /> : <NonAIInteraction />}
        </div>
      );
      break;
    default:
      content = <Tutorial />;
      break;
  }

  return (
    <PanelGroup direction="horizontal">
      {/* 折りたたみ中でも幅を5%残し、ボタンを表示 */}
      <Panel
        defaultSize={15}
        minSize={collapsed ? 3 : 15}
        maxSize={collapsed ? 3 : 15}
        collapsible
      >
        <div className="h-full flex items-center justify-center relative bg-gray-50 border-r-3 border-gray-200">
          {collapsed ? (
            <div className="flex flex-col">
              <button
                onClick={() => setCollapsed(false)}
                className="bg-white shadow px-2 py-1 rounded hover:bg-gray-200 transition text-sm"
                title="展開"
              >
                ▶
              </button>
              <span className="text-xs mt-2 text-gray-500">Open</span>
            </div>
          ) : (
            <div className="w-full h-full overflow-auto">
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => setCollapsed(true)}
                  className="bg-white shadow px-2 py-1 rounded hover:bg-gray-200 transition text-sm"
                  title="折りたたみ"
                >
                  ◀
                </button>
              </div>
              <Overview />
            </div>
          )}
        </div>
      </Panel>
      {!collapsed && (
        <PanelResizeHandle className="w-[3px] bg-gray-200 cursor-col-resize" />
      )}
      <Panel defaultSize={collapsed ? 95 : 85}>
        <div className="w-full h-full overflow-auto">{content}</div>
      </Panel>
    </PanelGroup>
  );
}
