"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { ArrowLeft, Check, MessageSquare, Save, Sparkles } from "lucide-react";

import { SectionHeading } from "../settings/SectionHeading";
import { ToggleRow } from "../personalization/ToggleRow";
import { InputField } from "../personalization/fields/InputField";
import { SelectField } from "../personalization/fields/SelectField";
import { authClient } from "@/lib/authentication/auth-client";

interface PersonalizationSettings {
  enabled: boolean;
  nickname: string;
  profession: string;
  interests: string;
  responseStyle: string;
  responseLength: string;
  technicalLevel: string;
  emojis: boolean;
  structuredResponses: boolean;
  instructions: string;
}

type SelectId = "style" | "length" | "technical" | null;

const defaultSettings: PersonalizationSettings = {
  enabled: true,
  nickname: "",
  profession: "",
  interests: "",
  responseStyle: "balanced",
  responseLength: "concise",
  technicalLevel: "adaptive",
  emojis: false,
  structuredResponses: true,
  instructions: "",
};

export default function PersonalizationPage() {
  const [settings, setSettings] =
    useState<PersonalizationSettings>(defaultSettings);

  const [openSelect, setOpenSelect] = useState<SelectId>(null);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const userId = session?.user?.id;

  useEffect(() => {
    if (sessionLoading || !userId) {
      return;
    }

    let cancelled = false;

    const loadSettings = async () => {
      try {
        const response = await fetch(`/api/settings/${userId}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user settings.");
        }

        const result = await response.json();
        const data = result?.data ?? result;

        if (cancelled) {
          return;
        }

        setSettings({
          enabled: data.enabled ?? defaultSettings.enabled,
          nickname: data.nickname ?? defaultSettings.nickname,
          profession: data.profession ?? defaultSettings.profession,
          interests: data.interests ?? defaultSettings.interests,

          responseStyle: data.responseStyle ?? defaultSettings.responseStyle,

          responseLength: data.responseLength ?? defaultSettings.responseLength,

          technicalLevel: data.technicalLevel ?? defaultSettings.technicalLevel,

          emojis: data.emojis ?? defaultSettings.emojis,

          structuredResponses:
            data.structuredResponses ?? defaultSettings.structuredResponses,

          instructions: data.instructions ?? defaultSettings.instructions,
        });
      } catch (error) {
        if (!cancelled) {
          console.error("[SETTINGS FETCH ERROR]:", error);
        }
      }
    };

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, [userId, sessionLoading]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenSelect(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const updateSetting = <K extends keyof PersonalizationSettings>(
    key: K,
    value: PersonalizationSettings[K],
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSaved(false);
  };

  const handleSave = async () => {
    if (!userId) {
      console.error("[SETTINGS SAVE ERROR]: User session not found.");
      return;
    }

    if (saving) {
      return;
    }

    try {
      setSaving(true);
      setSaved(false);

      const response = await fetch(`/api/settings/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "Failed to update user settings.");
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error) {
      console.error("[SETTINGS SAVE ERROR]:", error);
    } finally {
      setSaving(false);
    }
  };

  if (sessionLoading) {
    return (
      <main className="min-h-full bg-[#0b0d0d] text-[#edf5fc]">
        <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="animate-pulse">
            <div className="h-4 w-32 rounded bg-[#1d2222]" />

            <div className="mt-8 h-8 w-52 rounded bg-[#1d2222]" />

            <div className="mt-3 h-5 w-full max-w-xl rounded bg-[#1d2222]" />

            <div className="mt-8 h-20 rounded-2xl border border-[#303737] bg-[#141818]" />

            <div className="mt-10 space-y-3">
              <div className="h-20 rounded-2xl border border-[#303737] bg-[#141818]" />
              <div className="h-20 rounded-2xl border border-[#303737] bg-[#141818]" />
              <div className="h-20 rounded-2xl border border-[#303737] bg-[#141818]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-[#0b0d0d] text-[#edf5fc]">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <Link
          href="/profile/settings"
          className="inline-flex items-center gap-2 text-xs text-[#697171] transition-colors hover:text-[#edf5fc] focus:outline-none focus:ring-2 focus:ring-[#23ce6b]/20"
        >
          <ArrowLeft size={15} strokeWidth={1.8} />
          Back to settings
        </Link>

        <div className="mt-7 sm:mt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#23ce6b]">
            NEXUS
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
            Personalization
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#697171]">
            Tell NEXUS how you want it to communicate and what context should be
            useful when helping you.
          </p>
        </div>

        <section className="mt-7 overflow-hidden rounded-2xl border border-[#303737] bg-[#141818] sm:mt-8">
          <ToggleRow
            icon={Sparkles}
            title="Personalization"
            description="Allow NEXUS to adapt responses using your preferences."
            enabled={settings.enabled}
            onChange={(value) => updateSetting("enabled", value)}
          />
        </section>

        <section className="mt-9 sm:mt-10">
          <SectionHeading
            title="About you"
            description="Optional information that helps NEXUS give more relevant responses."
          />

          <div className="mt-4 space-y-3">
            <InputField
              label="Nickname"
              description="What should NEXUS call you?"
              value={settings.nickname}
              onChange={(value) => updateSetting("nickname", value)}
              placeholder="e.g. Alex"
            />

            <InputField
              label="Profession or role"
              description="Your current role or area of work."
              value={settings.profession}
              onChange={(value) => updateSetting("profession", value)}
              placeholder="e.g. Product Designer"
            />

            <InputField
              label="Interests"
              description="Topics or areas you'd like NEXUS to know about."
              value={settings.interests}
              onChange={(value) => updateSetting("interests", value)}
              placeholder="e.g. photography, startups, technology"
            />
          </div>
        </section>

        <section className="mt-9 sm:mt-10">
          <SectionHeading
            title="Response preferences"
            description="Choose how NEXUS should communicate with you."
          />

          <div className="mt-4 space-y-3">
            <SelectField
              id="style"
              label="Response style"
              value={settings.responseStyle}
              open={openSelect === "style"}
              onOpen={() =>
                setOpenSelect(openSelect === "style" ? null : "style")
              }
              onClose={() => setOpenSelect(null)}
              onChange={(value) => {
                updateSetting("responseStyle", value);
                setOpenSelect(null);
              }}
              options={[
                {
                  value: "balanced",
                  label: "Balanced",
                  description: "A natural mix of friendly and direct.",
                },
                {
                  value: "direct",
                  label: "Direct",
                  description: "Short, clear, and straight to the point.",
                },
                {
                  value: "friendly",
                  label: "Friendly",
                  description: "More conversational and approachable.",
                },
                {
                  value: "professional",
                  label: "Professional",
                  description: "Formal and business-oriented.",
                },
              ]}
            />

            <SelectField
              id="length"
              label="Response length"
              value={settings.responseLength}
              open={openSelect === "length"}
              onOpen={() =>
                setOpenSelect(openSelect === "length" ? null : "length")
              }
              onClose={() => setOpenSelect(null)}
              onChange={(value) => {
                updateSetting("responseLength", value);
                setOpenSelect(null);
              }}
              options={[
                {
                  value: "concise",
                  label: "Concise",
                  description: "Keep responses short and focused.",
                },
                {
                  value: "balanced",
                  label: "Balanced",
                  description: "Enough detail without overexplaining.",
                },
                {
                  value: "detailed",
                  label: "Detailed",
                  description: "Deeper explanations with useful examples.",
                },
              ]}
            />

            <SelectField
              id="technical"
              label="Technical level"
              value={settings.technicalLevel}
              open={openSelect === "technical"}
              onOpen={() =>
                setOpenSelect(openSelect === "technical" ? null : "technical")
              }
              onClose={() => setOpenSelect(null)}
              onChange={(value) => {
                updateSetting("technicalLevel", value);
                setOpenSelect(null);
              }}
              options={[
                {
                  value: "adaptive",
                  label: "Adaptive",
                  description: "Adjust explanations based on the question.",
                },
                {
                  value: "beginner",
                  label: "Beginner",
                  description: "Simple language and basic examples.",
                },
                {
                  value: "intermediate",
                  label: "Intermediate",
                  description: "Assume some existing technical knowledge.",
                },
                {
                  value: "advanced",
                  label: "Advanced",
                  description: "Use deeper technical explanations.",
                },
              ]}
            />
          </div>
        </section>

        <section className="mt-9 sm:mt-10">
          <SectionHeading
            title="Communication"
            description="Fine-tune how responses are presented."
          />

          <div className="mt-4 overflow-hidden rounded-2xl border border-[#303737] bg-[#141818]">
            <ToggleRow
              icon={MessageSquare}
              title="Use emojis"
              description="Allow NEXUS to use emojis when they fit the conversation."
              enabled={settings.emojis}
              onChange={(value) => updateSetting("emojis", value)}
            />

            <div className="mx-5 border-t border-[#303737]" />

            <ToggleRow
              icon={MessageSquare}
              title="Structured responses"
              description="Use headings, lists, and clear sections when useful."
              enabled={settings.structuredResponses}
              onChange={(value) => updateSetting("structuredResponses", value)}
            />
          </div>
        </section>

        <section className="mt-9 sm:mt-10">
          <SectionHeading
            title="Custom instructions"
            description="Give NEXUS additional guidance about how you'd like it to respond."
          />

          <textarea
            value={settings.instructions}
            onChange={(event) =>
              updateSetting("instructions", event.target.value)
            }
            rows={5}
            placeholder="Example: Explain concepts with practical examples and avoid unnecessary introductions."
            className="mt-4 block w-full resize-none rounded-2xl border border-[#303737] bg-[#141818] px-4 py-3.5 text-sm leading-6 text-[#edf5fc] outline-none transition-all placeholder:text-[#5f6666] hover:border-[#414949] focus:border-[#23ce6b]/60 focus:ring-1 focus:ring-[#23ce6b]/20"
          />

          <p className="mt-2 text-[11px] leading-5 text-[#5f6666]">
            These instructions will be included when NEXUS generates responses.
          </p>
        </section>

        <div className="mt-7 flex justify-end pb-6 sm:mt-8 sm:pb-8">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#23ce6b] px-5 text-sm font-semibold text-[#0b0d0d] transition-all duration-200 hover:bg-[#32dc79] hover:shadow-[0_0_24px_rgba(35,206,107,0.12)] focus:outline-none focus:ring-2 focus:ring-[#23ce6b]/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saved ? (
              <>
                <Check size={16} strokeWidth={2.2} />
                Saved
              </>
            ) : saving ? (
              <>
                <Save size={16} strokeWidth={1.9} />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} strokeWidth={1.9} />
                Save changes
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
