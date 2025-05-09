// src/components/game/game-over-dialog.tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useGameState } from "@/context/game-state-context";
import { AlertTriangle, RotateCcw } from "lucide-react";

export function GameOverDialog() {
  const { state, dispatch } = useGameState();

  const handleRestartGame = () => {
    dispatch({ type: 'INITIALIZE_GAME' });
  };

  if (!state.isGameOver) {
    return null;
  }

  return (
    <AlertDialog open={state.isGameOver}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-10 w-10 text-destructive" />
            <AlertDialogTitle className="text-2xl">Game Over</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            {state.gameOverMessage || "Unfortunately, your financial journey has come to an end."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={handleRestartGame} className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart Game
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
