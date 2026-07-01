"use client";

import { useState, type FormEvent } from "react";

const kpiOptions = [
  { value: "user-growth", label: "User Growth", icon: "trending_up" },
  { value: "operational-efficiency", label: "Operational Efficiency", icon: "settings_suggest" },
  { value: "revenue-generation", label: "Revenue Generation", icon: "payments" },
  { value: "brand-authority", label: "Brand Authority", icon: "verified" },
];

const priorityOptions = [
  { value: "scalability", label: "Scalability", defaultChecked: true },
  { value: "security", label: "Security", defaultChecked: false },
  { value: "maintenance", label: "Maintenance", defaultChecked: false },
  { value: "speed", label: "Speed", defaultChecked: true },
];

type SubmitState = "idle" | "submitting" | "success" | "error";

/**
 * Strategic Context form. Mirrors the original Stitch
 * "strategic_context_step_2" screen exactly: a KPI selection grid
 * (defaulting to "Operational Efficiency" per the source markup), a
 * free-text infrastructure description, and a checkbox-pill group for
 * technical priorities. Submits to /api/contact as a structured
 * strategic-context inquiry since this is a standalone entry point, not
 * part of the Discovery -> Schedule funnel.
 */
export function StrategicContextForm() {
  const [selectedKpi, setSelectedKpi] = useState("operational-efficiency");
  const [priorities, setPriorities] = useState<Set<string>>(
    new Set(priorityOptions.filter((p) => p.defaultChecked).map((p) => p.value))
  );
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  function togglePriority(value: string) {
    setPriorities((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setError(null);

    const form = event.currentTarget;
    const infrastructureDescription = (
      form.elements.namedItem("infrastructure-description") as HTMLTextAreaElement
    ).value;

    const details = [
      `Primary KPI: ${kpiOptions.find((k) => k.value === selectedKpi)?.label}`,
      `Technical priorities: ${Array.from(priorities)
        .map((v) => priorityOptions.find((p) => p.value === v)?.label)
        .join(", ") || "None selected"}`,
      "",
      "Current infrastructure description:",
      infrastructureDescription,
    ].join("\n");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Strategic Context Submission",
          email: (form.elements.namedItem("context-email") as HTMLInputElement).value,
          details,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        setState("error");
        setError(result.error ?? "Something went wrong.");
        return;
      }

      setState("success");
      form.reset();
    } catch {
      setState("error");
      setError("Network error. Please check your connection and try again.");
    }
  }

  if (state === "success") {
    return (
      <div role="status" className="bg-surface-container-lowest p-8 rounded-xl whisper-shadow text-center">
        <span className="material-symbols-outlined text-4xl text-secondary mb-4 block" aria-hidden="true">
          check_circle
        </span>
        <h2 className="font-newsreader text-2xl font-bold text-primary mb-2">Strategy finalized.</h2>
        <p className="text-on-surface-variant text-sm">
          Our architects will review your context and follow up within one
          business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {error ? (
        <p role="alert" className="text-error text-sm font-bold">
          {error}
        </p>
      ) : null}

      {/* Question 1: Primary KPI */}
      <div className="space-y-6">
        <span className="font-newsreader text-2xl text-primary block">
          What is your primary KPI for this project?
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kpiOptions.map((kpi) => {
            const isSelected = selectedKpi === kpi.value;
            return (
              <button
                key={kpi.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedKpi(kpi.value)}
                className={
                  isSelected
                    ? "group flex items-center justify-between p-5 bg-surface-container-lowest rounded-xl whisper-shadow border border-primary transition-all text-left"
                    : "group flex items-center justify-between p-5 bg-surface-container-lowest rounded-xl whisper-shadow border border-transparent hover:border-primary/20 transition-all text-left"
                }
              >
                <span
                  className={
                    isSelected
                      ? "font-manrope font-semibold text-primary"
                      : "font-manrope font-semibold text-on-surface"
                  }
                >
                  {kpi.label}
                </span>
                <span
                  className={
                    isSelected
                      ? "material-symbols-outlined text-primary"
                      : "material-symbols-outlined text-outline group-hover:text-primary transition-colors"
                  }
                  aria-hidden="true"
                  style={isSelected ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {kpi.icon}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question 2: Current Infrastructure */}
      <div className="space-y-6">
        <label
          htmlFor="infrastructure-description"
          className="font-newsreader text-2xl text-primary block"
        >
          Current Infrastructure Description
        </label>
        <textarea
          id="infrastructure-description"
          name="infrastructure-description"
          className="w-full min-h-[160px] p-6 bg-surface-container-lowest rounded-xl border-none focus:ring-2 focus:ring-primary/20 whisper-shadow font-manrope text-on-surface placeholder:text-outline"
          placeholder="Describe your existing tech stack, legacy systems, and current pain points..."
        />
      </div>

      {/* Technical Priorities */}
      <div className="space-y-6">
        <span className="font-newsreader text-2xl text-primary block">Technical Priorities</span>
        <div className="flex flex-wrap gap-4">
          {priorityOptions.map((priority) => (
            <label
              key={priority.value}
              className="flex items-center gap-3 px-6 py-4 bg-surface-container-low rounded-full cursor-pointer hover:bg-surface-container-high transition-colors"
            >
              <input
                checked={priorities.has(priority.value)}
                onChange={() => togglePriority(priority.value)}
                className="w-5 h-5 rounded text-secondary border-none bg-white focus:ring-0"
                type="checkbox"
              />
              <span className="font-manrope font-medium text-primary">{priority.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Contact email (needed to follow up, not in original mockup but required to make this functional) */}
      <div>
        <label
          htmlFor="context-email"
          className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2"
        >
          Your Email
        </label>
        <input
          id="context-email"
          name="context-email"
          type="email"
          required
          className="block w-full px-0 py-2 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary-container"
        />
      </div>

      {/* Actions */}
      <div className="pt-8 flex items-center justify-between">
        <a
          href="/digital-architecture"
          className="flex items-center gap-2 font-manrope font-bold text-primary hover:text-secondary transition-colors group"
        >
          <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform" aria-hidden="true">
            arrow_back
          </span>
          Back
        </a>
        <button
          type="submit"
          disabled={state === "submitting"}
          className="px-10 py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full font-manrope font-bold tracking-wider whisper-shadow hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {state === "submitting" ? "Sending..." : "Finalize Strategy"}
        </button>
      </div>
    </form>
  );
}
