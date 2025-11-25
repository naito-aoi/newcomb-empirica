import React from "react";
import { Stage } from "./Stage";

export function Game() {

  return (
    <div className="h-full w-full flex">
      <div className="h-full w-full flex flex-col">
        <div className="h-full flex items-center justify-center">
          <Stage />
        </div>
      </div>
    </div>
  );
}