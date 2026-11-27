"use client";

import { UserPlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParticipants } from "@/hooks/use-participants";
import {
  addGuest,
  getGuestLabel,
  MAX_GUEST_NAME_LENGTH,
  removeGuest,
  renameGuest,
} from "@/lib/guests";
import { barra, canAddParticipant } from "@/lib/participants";

/** People without a character. The name is optional. */
export function GuestList() {
  const { guests, participants } = useParticipants();
  const canAdd = canAddParticipant(participants.length);

  return (
    <div className="flex flex-col gap-3">
      {guests.length > 0 && (
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {guests.map((guest, index) => {
            const label = getGuestLabel(guest, index);
            return (
              <li
                key={guest.id}
                className="arcade-edge flex items-center gap-2 rounded-arcade-card bg-card p-1.5 pl-2"
              >
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-arcade-control border-2 border-arcade-edge bg-secondary font-display text-2xl leading-none"
                >
                  {label.charAt(0).toUpperCase()}
                </span>
                <Input
                  aria-label={`Nombre de ${label} (opcional)`}
                  placeholder={`Invitado ${index + 1}`}
                  maxLength={MAX_GUEST_NAME_LENGTH}
                  autoComplete="off"
                  className="h-10 text-base"
                  value={guest.name}
                  onChange={(event) =>
                    barra.setGuests(renameGuest(guests, guest.id, event.target.value))
                  }
                />
                <Button
                  variant="ghost"
                  size="touch"
                  aria-label={`Quitar a ${label}`}
                  onClick={() => barra.setGuests(removeGuest(guests, guest.id))}
                >
                  <X />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
      <Button
        variant="secondary"
        size="chip"
        className="self-start"
        disabled={!canAdd}
        onClick={() => barra.setGuests(addGuest(guests))}
      >
        <UserPlus />
        Sumar invitado
      </Button>
    </div>
  );
}
