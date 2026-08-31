const sections = [
  {
    number: "01",
    title: "Information We Collect",
    content:
      "Depending on the features you use, NEXUS AI may process information that you provide directly, including messages, conversations, preferences, account information, and other content submitted while interacting with the application.",
  },
  {
    number: "02",
    title: "Conversation & Memory Data",
    content:
      "When memory functionality is enabled, NEXUS AI may store relevant conversational information. This allows the assistant to maintain useful context and provide more personalized responses across interactions.",
  },
  {
    number: "03",
    title: "How Information Is Used",
    content:
      "Information processed by NEXUS AI may be used to provide conversational functionality, maintain relevant context, operate application features, troubleshoot issues, and maintain the reliability and security of the service.",
  },
  {
    number: "04",
    title: "Data Security",
    content:
      "NEXUS AI is designed with privacy and security in mind. Reasonable technical and organizational safeguards are intended to protect information against unauthorized access, alteration, disclosure, or destruction.",
  },
  {
    number: "05",
    title: "Third-Party AI Services",
    content:
      "NEXUS AI uses third-party AI infrastructure as part of its processing pipeline. The application uses Groq AI models to generate responses. Data handling by third-party providers is subject to their respective policies and service agreements.",
  },
  {
    number: "06",
    title: "Data Minimization",
    content:
      "The application is designed to process information relevant to providing its functionality. Users should avoid submitting highly sensitive information unless the application explicitly requires it and appropriate protections are available.",
  },
  {
    number: "07",
    title: "Data Retention",
    content:
      "Information may be retained for as long as necessary to provide application functionality, maintain conversation history or memory, meet operational requirements, or comply with applicable obligations.",
  },
  {
    number: "08",
    title: "Your Data",
    content:
      "Where applicable, users may have rights concerning their personal information, including rights to access, correct, delete, or otherwise manage their information. Available controls depend on the application's implementation and applicable law.",
  },
  {
    number: "09",
    title: "Cookies & Similar Technologies",
    content:
      "NEXUS AI may use cookies or similar technologies when necessary for authentication, preferences, session management, security, or application functionality.",
  },
  {
    number: "10",
    title: "Children's Privacy",
    content:
      "NEXUS AI is not intentionally designed to collect personal information from children without appropriate authorization. If you believe a child has provided personal information improperly, the appropriate service administrator should be contacted.",
  },
  {
    number: "11",
    title: "Changes to This Privacy Policy",
    content:
      "This privacy policy may be updated when the application, its infrastructure, or its data practices change. The updated version will include a revised effective date.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-[#272d2d] text-[#edf5fc]">
      <section className="relative overflow-hidden border-b border-[#414949] bg-[#0b0d0d]">
        <div className="pointer-events-none absolute -right-25 -top-37.5 h-125 w-125 rounded-full bg-[#23ce6b]/4 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-6 py-24 lg:px-8 lg:py-28">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#23ce6b]" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9ba3a5]">
              Legal
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-[#edf5fc] sm:text-5xl lg:text-6xl">
            Privacy Policy
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#c2c8ce] sm:text-lg">
            NEXUS AI is designed to respect user privacy and protect the
            information required to provide its services.
          </p>

          <p className="mt-6 text-sm text-[#7f8585]">
            Last updated: August 31, 2026
          </p>
        </div>
      </section>

      <section className="bg-[#272d2d]">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="relative overflow-hidden rounded-3xl border border-[#414949] bg-[#303737]">
            <div className="absolute inset-x-0 top-0 h-px bg-[#23ce6b]" />

            <div className="p-8 sm:p-10 lg:p-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#23ce6b] text-lg font-bold text-[#101512]">
                ✓
              </div>

              <h2 className="mt-7 text-2xl font-semibold tracking-tight text-[#edf5fc] sm:text-3xl">
                Privacy and security by design.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#c2c8ce] sm:text-base">
                NEXUS AI is designed to handle user information responsibly.
                Data processing is intended to be limited to what is necessary
                for application functionality, while security safeguards are
                used to reduce the risk of unauthorized access and misuse.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  "Context-aware data handling",
                  "Protected application infrastructure",
                  "Responsible data processing",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-[#414949] bg-[#272d2d] px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#23ce6b]" />

                      <span className="text-xs font-medium text-[#c2c8ce]">
                        {item}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
              This privacy policy describes the general privacy approach of the
              NEXUS AI project. If the application is deployed publicly or
              commercially, this policy should be reviewed and adapted to
              reflect the actual infrastructure, data flows, retention periods,
              third-party providers, and applicable privacy laws.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
