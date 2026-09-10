export const shouldAnalyzeMemory = (query: string): boolean => {
  const normalizedQuery = query.toLowerCase().trim();

  const memorySignals = [
    "remember",
    "don't forget",
    "do not forget",
    "keep in mind",
    "save this",
    "store this",
    "my name is",
    "i am",
    "i'm",
    "call me",
    "you can call me",
    "i work",
    "i work as",
    "my job",
    "my profession",
    "i'm a",
    "i am a",
    "i study",
    "i'm studying",
    "i prefer",
    "i like",
    "i love",
    "i hate",
    "i don't like",
    "i dislike",
    "my hobby",
    "my hobbies",
    "i enjoy",
    "from now on",
    "in future",
    "going forward",
    "for future conversations",
    "always",
    "please use",
    "please call me",
  ];

  return memorySignals.some((signal) => normalizedQuery.includes(signal));
};
