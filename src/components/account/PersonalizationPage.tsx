"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { ArrowLeft, Check, MessageSquare, Save, Sparkles } from "lucide-react";
import { SectionHeading } from "../settings/SectionHeading";
import { ToggleRow } from "../personalization/ToggleRow";
import { InputField } from "../personalization/fields/InputField";
import { SelectField } from "../personalization/fields/SelectField";

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

export default function PersonalizationPage() {
  const [enabled, setEnabled] = useState(true);
  const [emojis, setEmojis] = useState(false);
  const [structuredResponses, setStructuredResponses] = useState(true);

  const [nickname, setNickname] = useState("");
  const [profession, setProfession] = useState("");
  const [interests, setInterests] = useState("");

  const [responseStyle, setResponseStyle] = useState("balanced");
  const [responseLength, setResponseLength] = useState("concise");
  const [technicalLevel, setTechnicalLevel] = useState("adaptive");

  const [instructions, setInstructions] = useState("");
  const [saved, setSaved] = useState(false);

  const [openSelect, setOpenSelect] = useState<SelectId>(null);

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

  const handleSave = () => {
    const settings: PersonalizationSettings = {
      enabled,
      nickname,
      profession,
      interests,
      responseStyle,
      responseLength,
      technicalLevel,
      emojis,
      structuredResponses,
      instructions,
    };

    // save settings to database

    console.log("NEXUS Personalization Settings:", settings);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

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
            enabled={enabled}
            onChange={setEnabled}
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
              value={nickname}
              onChange={setNickname}
              placeholder="e.g. Alex"
            />

            <InputField
              label="Profession or role"
              description="Your current role or area of work."
              value={profession}
              onChange={setProfession}
              placeholder="e.g. Product Designer"
            />

            <InputField
              label="Interests"
              description="Topics or areas you'd like NEXUS to know about."
              value={interests}
              onChange={setInterests}
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
              value={responseStyle}
              open={openSelect === "style"}
              onOpen={() =>
                setOpenSelect(openSelect === "style" ? null : "style")
              }
              onClose={() => setOpenSelect(null)}
              onChange={setResponseStyle}
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
              value={responseLength}
              open={openSelect === "length"}
              onOpen={() =>
                setOpenSelect(openSelect === "length" ? null : "length")
              }
              onClose={() => setOpenSelect(null)}
              onChange={setResponseLength}
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
              value={technicalLevel}
              open={openSelect === "technical"}
              onOpen={() =>
                setOpenSelect(openSelect === "technical" ? null : "technical")
              }
              onClose={() => setOpenSelect(null)}
              onChange={setTechnicalLevel}
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
              enabled={emojis}
              onChange={setEmojis}
            />

            <div className="mx-5 border-t border-[#303737]" />

            <ToggleRow
              icon={MessageSquare}
              title="Structured responses"
              description="Use headings, lists, and clear sections when useful."
              enabled={structuredResponses}
              onChange={setStructuredResponses}
            />
          </div>
        </section>

        <section className="mt-9 sm:mt-10">
          <SectionHeading
            title="Custom instructions"
            description="Give NEXUS additional guidance about how you'd like it to respond."
          />

          <textarea
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
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
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#23ce6b] px-5 text-sm font-semibold text-[#0b0d0d] transition-all duration-200 hover:bg-[#32dc79] hover:shadow-[0_0_24px_rgba(35,206,107,0.12)] focus:outline-none focus:ring-2 focus:ring-[#23ce6b]/30 active:scale-[0.98]"
          >
            {saved ? (
              <>
                <Check size={16} strokeWidth={2.2} />
                Saved
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
