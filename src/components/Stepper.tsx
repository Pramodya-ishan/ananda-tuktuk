"use client";

import { IconMinus, IconPlus } from "@tabler/icons-react";
import { AnimatedCount } from "./AnimatedCount";

type StepperProps = {
  name: string;
  label: string;
  value: number | null;
  min?: number;
  max: number;
  emptyLabel: string;
  decreaseLabel: string;
  increaseLabel: string;
  valueText: string;
  onChange: (value: number | null) => void;
};

/** A count picker with large touch targets. `null` means "not decided yet". */
export function Stepper({ name, label, value, min = 1, max, emptyLabel, decreaseLabel, increaseLabel, valueText, onChange }: StepperProps) {
  const step = (delta: number) => {
    if (value === null) return onChange(delta > 0 ? min : null);
    const next = value + delta;
    onChange(next < min ? null : Math.min(max, next));
  };
  return <div className="stepper" role="group" aria-label={label}
    onKeyDown={(event) => {
      if (event.key === "ArrowUp" || event.key === "ArrowRight") { event.preventDefault(); step(1); }
      if (event.key === "ArrowDown" || event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
    }}>
    <input type="hidden" name={name} value={value ?? ""} />
    <button type="button" className="stepper-button" aria-label={decreaseLabel} disabled={value === null} onClick={() => step(-1)}><IconMinus size={18} aria-hidden="true" /></button>
    <output className="stepper-value" aria-live="polite" data-empty={value === null}>
      <span className="sr-only">{valueText}</span>
      {value === null ? <span aria-hidden="true" className="stepper-empty">{emptyLabel}</span> : <AnimatedCount value={value} />}
    </output>
    <button type="button" className="stepper-button" aria-label={increaseLabel} disabled={value !== null && value >= max} onClick={() => step(1)}><IconPlus size={18} aria-hidden="true" /></button>
  </div>;
}
