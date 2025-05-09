// src/components/game/event-modal.tsx
"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { RandomEvent } from "@/types/game";
import { useGameState } from "@/context/game-state-context";
import { useToast } from "@/hooks/use-toast";

interface EventModalProps {
  event: RandomEvent;
  isOpen: boolean;
  onClose: () => void;
}

export function EventModal({ event, isOpen, onClose }: EventModalProps) {
  const { dispatch } = useGameState();
  const { toast } = useToast();

  const handleChoice = (choiceIndex: number) => {
    dispatch({ type: 'PROCESS_EVENT_CHOICE', payload: { event, choiceIndex } });
    toast({
      title: `Event: ${event.title}`,
      description: `You chose: "${event.choices[choiceIndex].text}". Outcome applied.`,
    });
    onClose();
  };

  const IconComponent = event.icon;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {IconComponent && <IconComponent className="h-8 w-8 text-primary" />}
            <AlertDialogTitle className="text-2xl">{event.title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            {event.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-2 sm:flex-col sm:gap-2">
          {event.choices.map((choice, index) => (
            <Button
              key={index}
              onClick={() => handleChoice(index)}
              variant={index === 0 ? "default" : "outline"}
              className="w-full"
            >
              {choice.text}
            </Button>
          ))}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
