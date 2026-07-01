"use client";

import { useState, type FormEvent } from "react";
import { BOOKING_TIME_SLOTS } from "@/lib/validate-booking";
import { useFunnelStorage } from "@/lib/use-funnel-storage";

type SubmitState = "idle" | "submitting" | "success" | "error";

const weekdayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Static calendar grid matching the original Stitch markup (a fixed
// "November 2024"-style month grid with day 13 pre-selected). The
// surrounding days from the previous month are rendered dim and
// non-interactive, exactly as in the source.
const leadingDimDays = [27, 28, 29, 30, 31];
const monthDays = Array.from({ length: 30 }, (_, i) => i + 1);

/**
 * Schedule Consultation form (Step 2 of 2, following Project Discovery).
 * Mirrors the original Stitch "schedule_consultation_step_2" screen: a
 * calendar date grid, a time-slot list, a "What to expect" sidebar, and
 * a trust/privacy panel - rather than a simplified day-of-week picker.
 */
export function BookingForm() {
  const { data: funnelData, clearData } = useFunnelStorage();
  const [selectedDay, setSelectedDay] = useState(13);
  const [selectedTime, setSelectedTime] = useState<string>("10:30 AM");
  const [state, setState] = useState<SubmitState>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setFormError(null);
    setFieldErrors({});

    const form = event.currentTarget;
    const data = {
      name: (form.elements.namedItem("fullName") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      date: `2026-11-${String(selectedDay).padStart(2, "0")}`,
      time: selectedTime,
      ...funnelData,
    };

    try {
      const response = await fetch("/api/schedule-consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setState("error");
        setFormError(result.error ?? "Something went wrong.");
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }

      setState("success");
      form.reset();
      clearData();
    } catch {
      setState("error");
      setFormError("Network error. Please check your connection and try again.");
    }
  }

  if (state === "success") {
    return (
      <div
        role="status"
        className="bg-surface-container-highest p-8 rounded-xl text-center"
      >
        <span
          className="material-symbols-outlined text-4xl text-secondary mb-4 block"
          aria-hidden="true"
        >
          check_circle
        </span>
        <h2 className="font-newsreader text-2xl font-bold text-primary mb-2">
          Appointment requested.
        </h2>
        <p className="text-on-surface-variant text-sm mb-6">
          We&apos;ll confirm your November {selectedDay} session at{" "}
          {selectedTime} by email shortly with a calendar invite.
        </p>
        <a href="/" className="text-sm font-bold text-secondary hover:text-primary transition-colors">
          ← Back to home
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {formError ? (
        <p role="alert" className="text-error text-sm font-bold mb-6">
          {formError}
        </p>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: The Scheduler */}
        <div className="lg:col-span-8 space-y-10">
          {/* Modern Calendar Interface */}
          <div className="bg-surface-container-low rounded-xl p-1 overflow-hidden whisper-shadow">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Date Picker */}
              <div className="p-8 bg-surface-container-lowest">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-newsreader text-xl text-primary">November 2026</h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      aria-label="Previous month"
                      className="p-2 hover:bg-surface-container rounded-full transition-colors"
                    >
                      <span className="material-symbols-outlined" aria-hidden="true">
                        chevron_left
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label="Next month"
                      className="p-2 hover:bg-surface-container rounded-full transition-colors"
                    >
                      <span className="material-symbols-outlined" aria-hidden="true">
                        chevron_right
                      </span>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-y-4 text-center">
                  {weekdayLabels.map((day) => (
                    <div
                      key={day}
                      className="text-xs font-bold uppercase tracking-widest text-outline py-2"
                    >
                      {day}
                    </div>
                  ))}
                  {leadingDimDays.map((day) => (
                    <div key={`lead-${day}`} className="py-3 text-surface-dim">
                      {day}
                    </div>
                  ))}
                  {monthDays.map((day) => {
                    const isSelected = selectedDay === day;
                    return (
                      <button
                        key={day}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedDay(day)}
                        className={
                          isSelected
                            ? "py-3 font-medium bg-primary text-on-primary rounded-lg shadow-lg shadow-primary/20"
                            : "py-3 font-medium hover:bg-surface-container rounded-lg transition-all"
                        }
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div className="p-8 lg:border-l border-outline-variant/15 flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="font-newsreader text-xl text-primary mb-1">
                    {selectedDay ? `November ${selectedDay}, 2026` : "Select a date"}
                  </h3>
                  <p className="text-sm text-outline font-medium">
                    {BOOKING_TIME_SLOTS.length} available slots
                  </p>
                </div>
                <div className="space-y-3 flex-grow overflow-y-auto max-h-[320px] pr-2">
                  {BOOKING_TIME_SLOTS.map((slot) => {
                    const isSelected = selectedTime === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedTime(slot)}
                        className={
                          isSelected
                            ? "w-full py-4 px-6 rounded-full border-2 border-primary bg-primary-container/10 text-primary font-extrabold text-left flex justify-between items-center"
                            : "w-full py-4 px-6 rounded-full border border-outline-variant/30 text-primary font-bold hover:bg-primary hover:text-white transition-all text-left flex justify-between items-center group"
                        }
                      >
                        <span>{slot}</span>
                        <span
                          className={
                            isSelected
                              ? "material-symbols-outlined"
                              : "material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity"
                          }
                          aria-hidden="true"
                        >
                          {isSelected ? "check_circle" : "schedule"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {fieldErrors.time ? (
                  <p className="text-error text-xs mt-2">{fieldErrors.time}</p>
                ) : null}
              </div>
            </div>
          </div>

          {/* Contact fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="full-name"
                className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2"
              >
                Full Name
              </label>
              <input
                id="full-name"
                name="fullName"
                type="text"
                required
                aria-invalid={Boolean(fieldErrors.name)}
                className="block w-full px-0 py-2 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary-container"
              />
              {fieldErrors.name ? (
                <p className="text-error text-xs mt-1">{fieldErrors.name}</p>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="booking-email"
                className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2"
              >
                Email
              </label>
              <input
                id="booking-email"
                name="email"
                type="email"
                required
                aria-invalid={Boolean(fieldErrors.email)}
                className="block w-full px-0 py-2 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary-container"
              />
              {fieldErrors.email ? (
                <p className="text-error text-xs mt-1">{fieldErrors.email}</p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right Column: What to Expect & Actions */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-primary-container text-on-primary-container p-8 rounded-xl whisper-shadow relative overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute -top-12 -right-12 w-32 h-32 bg-on-tertiary-container/10 rounded-full blur-3xl"
            />
            <h2 className="font-newsreader text-2xl mb-6 relative z-10">What to expect</h2>
            <ul className="space-y-6 relative z-10">
              <li className="flex gap-4">
                <span
                  className="material-symbols-outlined text-on-tertiary-container"
                  aria-hidden="true"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  timer
                </span>
                <div>
                  <h4 className="font-bold text-white">30-Minute Session</h4>
                  <p className="text-on-primary-container/80 text-sm leading-relaxed">
                    A focused deep dive into your current challenges and
                    future goals.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span
                  className="material-symbols-outlined text-on-tertiary-container"
                  aria-hidden="true"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  account_tree
                </span>
                <div>
                  <h4 className="font-bold text-white">Senior Architect</h4>
                  <p className="text-on-primary-container/80 text-sm leading-relaxed">
                    Consult directly with an industry veteran specializing in
                    agile infrastructure.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span
                  className="material-symbols-outlined text-on-tertiary-container"
                  aria-hidden="true"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  lightbulb
                </span>
                <div>
                  <h4 className="font-bold text-white">Actionable Blueprint</h4>
                  <p className="text-on-primary-container/80 text-sm leading-relaxed">
                    Walk away with a preliminary high-level architecture
                    draft for your project.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-surface-container-highest p-8 rounded-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-surface-container-lowest border border-outline-variant/15 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" aria-hidden="true">
                  verified_user
                </span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-outline font-bold">
                  Privacy Guaranteed
                </p>
                <p className="text-sm font-medium text-primary">
                  All sessions are covered by a standard NDA.
                </p>
              </div>
            </div>
            <button
              type="submit"
              disabled={state === "submitting"}
              className="w-full py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full font-bold text-lg hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {state === "submitting" ? "Confirming..." : "Confirm Appointment"}
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </button>
            <p className="text-center mt-4 text-xs text-outline font-medium">
              No credit card required for initial discovery.
            </p>
          </div>
        </aside>
      </div>
    </form>
  );
}
