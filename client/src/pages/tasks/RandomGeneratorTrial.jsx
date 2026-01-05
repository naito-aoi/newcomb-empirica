import React, { useState, useEffect, useRef } from "react";
import { useGame, usePlayer } from "@empirica/core/player/classic/react";
import { Button } from '@/components/animate-ui/components/buttons/button';
import { ConnectionMonitor } from "./ConnectionMonitor.jsx";

// 画像プレースホルダー（実際のパスに書き換えてください）
const IMG_BOX_CLOSED = "/fig/Newcomb/random-trial-box.png"; // 閉じた箱の画像など
const IMG_ITEM_A = "/fig/Newcomb/random-trial-full.png"; // 例: 当たり画像
const IMG_ITEM_B = "/fig/Newcomb/random-trial-empty.png"; // 例: 外れ画像

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function RandomGeneratorTrial() {
  const game = useGame();
  const player = usePlayer();
  const introStep = player.get("introStep");

  // 過去の抽選結果を保存するState
  // { step: 1, label: "当たり", image: "..." } のようなオブジェクトの配列
  const [history, setHistory] = useState([]);
  const [drawList, setDrawList] = useState(() => {
    // 初期化時にシャッフル
    const arr = Array(5).fill('One Box').concat(Array(5).fill('Two Boxes'));
    return shuffle(arr);
  });

  const MAX_TRIALS = 10;

  // スクロール用ref
  const bottomRef = useRef(null);

  // 既に終わっているかチェック（リロード対策）
  useEffect(() => {
    const savedHistory = player.get("lotteryResults");
    if (savedHistory && Array.isArray(savedHistory)) {
      setHistory(savedHistory);
    }
  }, [player]);

  // historyが更新されるたびに一番下へスクロール
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  // ボタンを押した時の処理
  const handleDraw = () => {
    // 10回終わっていたら何もしない
    if (history.length >= MAX_TRIALS) return;
    if (drawList.length === 0) return;

    // シャッフル済みリストから1つ取り出す
    const resultLabel = drawList[0];
    const resultImage = resultLabel === "One Box" ? IMG_ITEM_A : IMG_ITEM_B;

    const newEntry = {
      step: history.length + 1,
      label: resultLabel,
      image: resultImage
    };

    const newHistory = [...history, newEntry];
    setHistory(newHistory);
    setDrawList(drawList.slice(1));

    // Empiricaのサーバー側にデータを保存
    player.set("lotteryResults", newHistory);

    // 10回目に達したら終了フラグを立てる
    if (newHistory.length === MAX_TRIALS) {
      player.set('AIConversationFinished', true);
    }
  };

  return (
    <>
      <div className="flex flex-col w-2xl min-w-2xl h-full overflow-hidden shadow-xl bg-white">
        {/* ヘッダーエリア */}
        <div className="h-60 w-full p-4 border-b font-bold flex">
          <div className="w-300px">
            {/* 調査用のアイコンなどはそのまま */}
            <img src="/fig/misc/survey.svg" alt="Survey" className="h-48 w-48 mx-auto" />
          </div>
          <div className="w-[calc(100%-300px)] flex flex-col justify-between">
            <div className="h-40">
              <div className="text-xl">{introStep}</div>
              <div className="bg-white mt-4">
                <div className="text-sm font-light">
                  Before starting the main task, let's try the random generator.
                  You can test it up to <b>10 times</b>.
                  Please note that the results from this trial will not affect the outcome of the main task.
                </div>
                <div className="text-sm font-light mt-2">
                  Please click the "<b>Draw a label</b>" button.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* メインエリア：抽選タスク */}
        <div id="ai-conversation" className="flex flex-col h-full overflow-y-auto py-4 px-12 gap-4 bg-sky-50">

          {/* グリッドのヘッダー */}
          <div className="grid grid-cols-2 gap-4 text-sm font-bold text-neutral-500 border-b pb-2 mb-2 text-center">
            <div>Draw</div>
            <div>Label</div>
            {/* <div>Contents of Box B</div> */}
          </div>

          <div className="overflow-auto gap-4 flex flex-col">
            {/* 履歴の表示（完了した試行） */}
            {history.map((record, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 items-center h-20 bg-white p-2 rounded shadow-sm">
                {/* 列1: 無効化されたボタン */}
                <div className="flex justify-center">
                  <Button disabled variant="secondary" className="w-[120px] opacity-50">
                    Opened #{record.step}
                  </Button>
                </div>

                {/* 列2: 結果ラベル */}
                <div className="flex justify-center items-center text-lg font-semibold h-16">
                  <span id={(record.label === "One Box") ? "one-boxer" : (record.label === "Two Boxes") ? "two-boxer" : ""}>{record.label}</span>
                </div>

                {/* 列3: 箱の中身（画像） */}
                {/* <div className="flex justify-center items-center">
                  <img src={record.image} alt="Result" className="h-16 w-16 object-contain" />
                </div> */}
              </div>
            ))}

            {/* 現在のアクティブな試行（まだ10回未満の場合のみ表示） */}
            {history.length < MAX_TRIALS && (
              <div className="grid grid-cols-2 gap-4 items-center h-30 bg-white p-2 rounded shadow border-2 border-blue-200 animate-in fade-in slide-in-from-bottom-2">
                {/* 列1: アクティブなボタン */}
                <div className="relative flex justify-center items-center h-16 w-full">
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    <div className="h-8 w-20 rounded-md bg-green-500 animate-ping"></div>
                  </div>
                  <Button onClick={handleDraw} className="relative w-[120px] bg-green-500 hover:bg-green-700 text-white z-10">
                    Draw a label
                  </Button>
                </div>

                {/* 列2: 未定状態 */}
                <div className="flex justify-center items-center text-neutral-400">
                  ???
                </div>

                {/* 列3: 閉じた箱の画像 */}
                {/* <div className="flex justify-center items-center">
                  <div className="h-24 w-24 rounded flex items-center justify-center text-neutral-400 text-xs overflow-hidden relative">
                    <img
                      src={IMG_BOX_CLOSED}
                      alt="Closed Box"
                      className="h-full w-auto object-cover"
                    />
                  </div>
                </div> */}
              </div>
            )}
            {/* スクロール用ダミー要素 */}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* フッターエリア：タスク終了後のボタン */}
        <div className="relative flex flex-col items-center min-h-22 w-full p-4 border-t bg-gray-50 gap-2">
          {(player.get("AIConversationFinished")) && (
            <div className="relative flex items-center justify-center gap-2 w-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-32 rounded-md bg-green-500 animate-ping"></div>
              </div>
              <Button
                size="icon"
                className="relative h-12 w-50 text-white bg-green-500 hover:bg-green-700 transition duration-150 shadow-lg text-lg rounded-lg mx-auto"
                onClick={() => {
                  player.set("introStep", "Decision making task");
                  player.set('introStepIndex', 2);
                  player.set('introDone', true);
                }}
              >
                Start the Task
              </Button>
            </div>
          )}
          <div className="absolute text-xs text-neutral-500 font-light mt-13 mb-0 text-center">
            * This is a practice. No real earnings are given in this trial.
          </div>
        </div>
      </div>
      <ConnectionMonitor />
    </>
  )
}