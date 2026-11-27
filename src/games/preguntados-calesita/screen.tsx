"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";

import { CharacterAvatar } from "@/components/characters/character-avatar";
import { PromptCard } from "@/components/game/prompt-card";
import { Button } from "@/components/ui/button";
import { getQuestion } from "@/content/preguntados-calesita";
import { reduceSession, sessionStore, SLUG } from "@/games/preguntados-calesita/logic";
import { getTurnParticipant, type Game } from "@/games/rounds/logic";
import { RoundsScreen } from "@/games/rounds/screen";
import { useGameCast } from "@/hooks/use-game-cast";
import { cn } from "@/lib/utils";

/** One question per participant per option, so everyone answers the same amount. */
const toRounds = (perPlayer: number, participants: number) => perPlayer * participants;

function QuestionCard({ game }: { game: Game }) {
  const question = getQuestion(game.cardId);
  const player = getTurnParticipant(game);
  const { forSeats } = useGameCast(SLUG);
  const [character] = forSeats(player.seatIds);

  return (
    <>
      <div className="flex items-center justify-center gap-3">
        {character && <CharacterAvatar character={character} size="sm" />}
        <h1 className="min-w-0 text-center font-display text-4xl leading-none">
          Le toca a <span className="text-brand-yellow">{player.name}</span>
        </h1>
      </div>
      <p className="text-center text-lg font-semibold text-muted-foreground">{question?.category}</p>
      <PromptCard promptId={game.cardId} text={question?.text ?? ""} category="classic" />
    </>
  );
}

type AnswersProps = {
  game: Game;
  onAward: (winnerIds: string[]) => void;
};

/** The player taps an answer; the app reveals it before moving on. */
export function Answers({ game, onAward }: AnswersProps) {
  const [chosen, setChosen] = useState<number | null>(null);
  const question = getQuestion(game.cardId);
  if (!question) return null;
  const isRevealed = chosen !== null;
  const isRight = chosen === question.answer;

  return (
    <div className="flex flex-col gap-3">
      <ul className="grid gap-2">
        {question.options.map((option, index) => (
          <li key={option}>
            <Button
              variant={isRevealed && index === question.answer ? "marquee" : "secondary"}
              size="xl"
              disabled={isRevealed && index !== question.answer && index !== chosen}
              className={cn(
                "w-full justify-start px-4",
                isRevealed && index === chosen && !isRight && "bg-brand-pink text-brand-ink",
              )}
              onClick={() => !isRevealed && setChosen(index)}
            >
              {isRevealed && index === question.answer && <Check />}
              {isRevealed && index === chosen && !isRight && <X />}
              {option}
            </Button>
          </li>
        ))}
      </ul>
      {isRevealed && (
        <>
          <p role="status" className="text-center text-2xl font-bold">
            {isRight ? "¡Correcto! Suma un punto." : "¡Incorrecto!"}
          </p>
          <Button
            variant="marquee"
            size="xl"
            className="w-full"
            onClick={() => onAward(isRight ? [getTurnParticipant(game).id] : [])}
          >
            Siguiente
          </Button>
        </>
      )}
    </div>
  );
}

export default function PreguntadosCalesitaScreen() {
  return (
    <RoundsScreen
      slug={SLUG}
      sessionStore={sessionStore}
      reduceSession={reduceSession}
      mode="players"
      roundsLabel="¿Cuántas preguntas para cada uno?"
      roundsOptions={[3, 5, 7]}
      defaultRounds={3}
      toRounds={toRounds}
      roundLabel="Pregunta"
      renderCard={(game) => <QuestionCard game={game} />}
      judge="one"
      judgeQuestion=""
      renderJudge={(game, award) => <Answers key={game.round} game={game} onAward={award} />}
      resultsTitle="¡Terminó la trivia!"
      endDescription="Se termina esta partida y se pierde el puntaje. Las preguntas que ya salieron no se repiten en la próxima."
    />
  );
}
