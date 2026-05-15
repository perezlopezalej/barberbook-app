interface Props {
  currentStep: number;
  totalSteps: number;
}

export function BookingProgressBar({ currentStep, totalSteps }: Props) {
  const pct = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);
  return (
    <div className="h-1 bg-zinc-100 w-full">
      <div
        className="h-full bg-amber-500 transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
