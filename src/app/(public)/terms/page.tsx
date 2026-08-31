const sections = [
  {
    number: "01",
    title: "Acceptance of Terms",
    content:
      "By accessing or using NEXUS AI, you agree to comply with these Terms of Service. If you do not agree with these terms, you should not use the application.",
  },
  {
    number: "02",
    title: "Description of the Service",
    content:
      "NEXUS AI is an AI-powered assistant designed to provide conversational responses, maintain relevant context, reason through requests, and interact with supported tools or services. Features may change, improve, or be discontinued as the project evolves.",
  },
  {
    number: "03",
    title: "AI-Generated Information",
    content:
      "NEXUS AI uses artificial intelligence models to generate responses. AI-generated responses may occasionally be incomplete, inaccurate, outdated, or unsuitable for a particular situation. Important information should be independently verified before being relied upon.",
  },
  {
    number: "04",
    title: "User Responsibilities",
    content:
      "You are responsible for the information you provide to the application and for how you use generated responses. You agree not to use NEXUS AI for unlawful activities, abuse the service, attempt to compromise its security, or interfere with its normal operation.",
  },
  {
    number: "05",
    title: "Account & Access",
    content:
      "Where account functionality is provided, you are responsible for maintaining the security of your account credentials and for activity performed through your account.",
  },
  {
    number: "06",
    title: "Availability",
    content:
      "NEXUS AI is an evolving application. Availability, performance, features, integrations, and supported capabilities may change without prior notice. Temporary interruptions may occur due to maintenance, infrastructure issues, or third-party services.",
  },
  {
    number: "07",
    title: "Third-Party Services",
    content:
      "Certain functionality may depend on third-party services, APIs, AI models, or infrastructure. NEXUS AI is not responsible for outages, changes, limitations, or failures originating from external services.",
  },
  {
    number: "08",
    title: "Intellectual Property",
    content:
      "The NEXUS AI application, branding, interface, original content, and associated software are protected by applicable intellectual-property laws. Protected project materials may not be reproduced, modified, distributed, or commercially exploited without appropriate authorization.",
  },
  {
    number: "09",
    title: "Limitation of Liability",
    content:
      "To the extent permitted by applicable law, NEXUS AI and its contributors shall not be liable for indirect, incidental, consequential, or other damages resulting from the use of, or inability to use, the service.",
  },
  {
    number: "10",
    title: "Changes to These Terms",
    content:
      "These terms may be updated as the project develops. Continued use of NEXUS AI after changes are published constitutes acceptance of the updated terms.",
  },
];

export default function TermsPage() {
  return (
    <div className="bg-[#272d2d] text-[#edf5fc]">
      <section className="relative overflow-hidden border-b border-[#414949] bg-[#0b0d0d]">
        <div className="pointer-events-none absolute -left-25 -top-37.5 h-125 w-125 rounded-full bg-[#23ce6b]/[0.035] blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-6 py-24 lg:px-8 lg:py-28">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#23ce6b]" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9ba3a5]">
              Legal
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-[#edf5fc] sm:text-5xl lg:text-6xl">
            Terms of Service
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#c2c8ce] sm:text-lg">
            These terms describe the general rules and conditions for using
            NEXUS AI.
          </p>

          <p className="mt-6 text-sm text-[#7f8585]">
            Last updated: August 31, 2026
          </p>
        </div>
      </section>

      <section className="bg-[#272d2d]">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="rounded-3xl border border-[#414949] bg-[#303737] p-8 sm:p-10">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#23ce6b]" />

              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9ba3a5]">
                Agreement
              </span>
            </div>

            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-[#edf5fc]">
              Using NEXUS AI responsibly.
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#c2c8ce]">
              NEXUS AI is intended to provide useful AI-assisted functionality.
              By using the application, you acknowledge that AI-generated
              information can contain errors and that you remain responsible for
              decisions made using the service.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#0b0d0d]">
        <div className="mx-auto max-w-5xl px-6 pb-24 lg:px-8 lg:pb-32">
          <div className="border-t border-[#414949]">
            {sections.map((section) => (
              <article
                key={section.number}
                className="grid gap-5 border-b border-[#303737] py-9 md:grid-cols-[90px_1fr] md:gap-8"
              >
                <div>
                  <span className="font-mono text-xs font-medium text-[#23ce6b]">
                    {section.number}
                  </span>
                </div>

                <div className="max-w-3xl">
                  <h2 className="text-lg font-semibold tracking-tight text-[#edf5fc] sm:text-xl">
                    {section.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-[#aeb7ba] sm:text-[15px]">
                    {section.content}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-[#414949] bg-[#161a1a] p-6">
            <p className="text-xs leading-6 text-[#8f999b]">
              These terms are general project terms and are not a substitute for
              legal advice. If NEXUS AI is deployed as a commercial service,
              these terms should be reviewed and adapted by a qualified legal
              professional for the applicable jurisdiction and business model.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
