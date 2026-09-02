"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useFunnelStorage } from "@/lib/use-funnel-storage";

const goalOptions = [
  {
    value: "web-dev",
    label: "Web Development",
    description: "Scalable, high-performance digital presence.",
  },
  {
    value: "digital-transformation",
    label: "Digital Transformation",
    description: "Modernizing legacy systems for efficiency.",
  },
  {
    value: "growth",
    label: "Growth & Strategy",
    description: "Optimizing for market expansion and revenue.",
  },
];

const businessStageOptions = [
  { value: "early", label: "Early Stage / Startup" },
  { value: "scaling", label: "Growth / Scaling Phase" },
  { value: "enterprise", label: "Established Enterprise" },
  { value: "transformation", label: "Undergoing Pivot" },
];

/**
 * Project Discovery form (Step 1 of 2). Mirrors the original Stitch
 * "project_discovery_step_1" screen: a goal radio-card group, business
 * stage select, and free-text "Tell us more" field, defaulting to
 * "growth" per the source markup's `checked` attribute.
 */
export function DiscoveryForm() {
  const router = useRouter();
  const { data, updateData, isLoaded } = useFunnelStorage();
  const [selectedGoal, setSelectedGoal] = useState<string>("growth");

  useEffect(() => {
    if (isLoaded && data.goal) {
      setSelectedGoal(data.goal);
    }
  }, [isLoaded, data.goal]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const businessStage = (form.elements.namedItem("business-stage") as HTMLSelectElement).value;
    const moreInfo = (form.elements.namedItem("more-info") as HTMLTextAreaElement).value;

    updateData({ goal: selectedGoal, businessStage, moreInfo });
    router.push("/schedule-consultation");
  }

  if (!isLoaded) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="h-32 bg-surface-container-lowest rounded-xl" />
        <div className="h-32 bg-surface-container-lowest rounded-xl" />
        <div className="h-14 bg-surface-container-highest rounded-xl" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Question 1: Primary Goal */}
      <div className="space-y-6">
        <span className="font-newsreader text-2xl text-ink font-semibold block">
          What is your primary goal?
        </span>
        <div className="grid grid-cols-1 gap-4">
          {goalOptions.map((option) => {
            const isChecked = selectedGoal === option.value;
            return (
              <label
                key={option.value}
                className={`group relative flex items-center p-6 bg-surface-container-lowest rounded-xl cursor-pointer hover:bg-surface-container transition-colors border-l-4 ${
                  isChecked ? "border-primary" : "border-transparent"
                }`}
              >
                <input
                  className="hidden peer"
                  name="goal"
                  type="radio"
                  value={option.value}
                  checked={isChecked}
                  onChange={() => setSelectedGoal(option.value)}
                />
                <div className="flex-1">
                  <span className="block font-bold text-lg text-ink mb-1">
                    {option.label}
                  </span>
                  <span className="block text-sm text-on-surface-variant">
                    {option.description}
                  </span>
                </div>
                <div className={isChecked ? "opacity-100 transition-opacity" : "opacity-0 transition-opacity"}>
                  <span className="material-symbols-outlined text-ink" aria-hidden="true">
                    check_circle
                  </span>
                </div>
                <div
                  className={`absolute inset-0 border-2 rounded-xl pointer-events-none ${
                    isChecked ? "border-primary/10" : "border-transparent"
                  }`}
                  aria-hidden="true"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Question 2: Business Stage */}
      <div className="space-y-4">
        <label
          htmlFor="business-stage"
          className="font-newsreader text-2xl text-ink font-semibold block"
        >
          Current Business Stage
        </label>
        <div className="relative">
          <select
            id="business-stage"
            name="business-stage"
            defaultValue={data.businessStage ?? ""}
            className="w-full bg-surface-container-highest border-none rounded-xl p-4 text-on-surface appearance-none focus:ring-2 focus:ring-primary transition-all"
          >
            <option disabled value="">
              Select your stage
            </option>
            {businessStageOptions.map((stage) => (
              <option key={stage.value} value={stage.value}>
                {stage.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <span className="material-symbols-outlined text-on-surface-variant" aria-hidden="true">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Question 3: Tell us more */}
      <div className="space-y-4">
        <label
          htmlFor="more-info"
          className="font-newsreader text-2xl text-ink font-semibold block"
        >
          Tell us more
        </label>
        <textarea
          id="more-info"
          name="more-info"
          rows={5}
          defaultValue={data.moreInfo ?? ""}
          placeholder="Describe the challenges you are facing or the vision you want to realize..."
          className="w-full bg-surface-container-highest border-none rounded-xl p-6 text-on-surface focus:ring-2 focus:ring-primary transition-all resize-none placeholder:text-on-surface-variant/50"
        />
      </div>

      {/* Action Area */}
      <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <a
          href="/"
          className="text-secondary font-bold flex items-center gap-2 group transition-all"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            arrow_back
          </span>
          <span>Save and Exit</span>
        </a>
        <button
          type="submit"
          className="w-full md:w-auto px-10 py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          Next Step: Schedule Consultation
          <span className="material-symbols-outlined" aria-hidden="true">
            arrow_forward
          </span>
        </button>
      </div>
    </form>
  );
}
