import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart } from "lucide-react";

const STEPS = [
  {
    key: "who",
    label: "Who's it for?",
    options: ["For her", "For him", "For baby", "For mom", "For friend"],
  },
  {
    key: "occasion",
    label: "What's the occasion?",
    options: [
      "Valentine's",
      "Birthday",
      "Mother's Day",
      "Father's Day",
      "Christmas",
      "Just because",
    ],
  },
  {
    key: "budget",
    label: "And the budget?",
    options: ["Under $40", "$40 — $80", "$80 — $150", "The sky's the limit"],
  },
] as const;

export function GiftFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const choose = (val: string) => {
    const key = STEPS[step].key;
    setAnswers((a) => ({ ...a, [key]: val }));
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
  };

  const done = Object.keys(answers).length === STEPS.length;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rose/40 via-background to-sage/30 px-6 py-20 sm:px-8 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1300px]">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <span className="font-script text-2xl text-bloom">stuck for ideas?</span>
            <h2 className="mt-2 font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl">
              The <span className="italic text-bloom">gift finder.</span>
            </h2>
            <p className="mt-6 max-w-md text-base text-muted-foreground">
              Three little questions. One perfectly stitched suggestion. We'll find something
              they'll actually keep.
            </p>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-8 shadow-lg sm:p-10">
            {!done ? (
              <>
                <div className="mb-6 flex items-center gap-2">
                  {STEPS.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i <= step ? "bg-bloom" : "bg-border"
                      }`}
                    />
                  ))}
                </div>
                <p className="font-script text-xl text-bloom">
                  Step {step + 1} of {STEPS.length}
                </p>
                <h3 className="mt-1 font-display text-3xl italic sm:text-4xl">
                  {STEPS[step].label}
                </h3>
                <div className="mt-6 flex flex-wrap gap-2">
                  {STEPS[step].options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => choose(opt)}
                      className="rounded-full border border-border bg-background px-5 py-2.5 text-sm transition-colors hover:border-bloom hover:bg-bloom hover:text-accent-foreground"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center">
                <Heart className="mx-auto h-10 w-10 fill-bloom text-bloom" />
                <h3 className="mt-4 font-display text-3xl italic">We've got just the thing.</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {answers.who} · {answers.occasion} · {answers.budget}
                </p>
                <p className="mt-6 text-base">
                  Browse our curated picks and check out the matching occasion page.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom"
                  >
                    See picks
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={reset}
                    className="rounded-full border border-border px-6 py-3 text-xs uppercase tracking-[0.22em] hover:border-bloom hover:text-bloom"
                  >
                    Start again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
