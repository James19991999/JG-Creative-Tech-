"use client";

import { useState } from "react";

const STORAGE_KEY = "jg-cookie-consent-detailed";

type Preferences = {
  analytics: boolean;
  marketing: boolean;
};

/**
 * Cookie category toggle grid matching the original Stitch "Operational
 * Frameworks" bento section. Essential cookies are always-on and not
 * toggleable (matches source: no checkbox, "Mandatory" badge).
 * Analytics defaults on, Marketing defaults off, matching the source's
 * `checked` attribute on the first toggle only.
 */
export function CookiePreferences() {
  const [preferences, setPreferences] = useState<Preferences>({
    analytics: true,
    marketing: false,
  });
  const [savedMessage, setSavedMessage] = useState(false);

  function toggle(key: keyof Preferences) {
    setPreferences((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage failures
      }
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2000);
      return next;
    });
  }

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h3 className="font-newsreader text-3xl font-bold text-primary">
          Operational Frameworks
        </h3>
        <p className="text-on-surface-variant uppercase tracking-wider font-semibold text-xs">
          Category Classifications
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Essential Cookies - always on, not toggleable */}
          <div className="bg-primary-container p-8 rounded-xl flex flex-col justify-between space-y-8 md:row-span-2">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-on-primary-container/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white" aria-hidden="true">
                  shield
                </span>
              </div>
              <h4 className="font-newsreader text-2xl font-bold text-white leading-tight">
                Essential Cookies
              </h4>
              <p className="text-on-primary-container leading-relaxed">
                These are the structural integrity of our platform. They
                enable secure login, session management, and load
                balancing. Without these, the site simply cannot function
                as designed.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-2">
              <span className="px-3 py-1 bg-white/10 rounded-full text-white text-[10px] font-bold uppercase tracking-widest">
                Mandatory
              </span>
              <div className="ml-auto flex items-center gap-2 text-white/60">
                <span className="text-xs font-medium">Always Active</span>
              </div>
            </div>
          </div>

          {/* Analytics & Performance */}
          <div className="bg-surface-container-lowest p-8 rounded-xl space-y-6 hover:bg-surface-container-high transition-colors duration-300">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h4 className="font-newsreader text-xl font-bold text-primary">
                  Analytics &amp; Performance
                </h4>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Helps us monitor traffic patterns and technical
                  bottlenecks to optimize the user experience.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <span className="sr-only">Toggle analytics cookies</span>
                <input
                  checked={preferences.analytics}
                  onChange={() => toggle("analytics")}
                  className="sr-only peer"
                  type="checkbox"
                />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
              </label>
            </div>
          </div>

          {/* Marketing & Advertising */}
          <div className="bg-surface-container-lowest p-8 rounded-xl space-y-6 hover:bg-surface-container-high transition-colors duration-300">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h4 className="font-newsreader text-xl font-bold text-primary">
                  Marketing &amp; Advertising
                </h4>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Used to deliver content and offers that align with your
                  business objectives and industry niche.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <span className="sr-only">Toggle marketing cookies</span>
                <input
                  checked={preferences.marketing}
                  onChange={() => toggle("marketing")}
                  className="sr-only peer"
                  type="checkbox"
                />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
              </label>
            </div>
          </div>
        </div>
        {savedMessage ? (
          <p role="status" className="text-xs font-bold text-secondary">
            Preferences saved.
          </p>
        ) : null}
    </section>
  );
}
