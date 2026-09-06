import { Sparkles, Wrench } from "lucide-react";

interface GenerationStatus {
  node: string;
  message: string;
  type: "thinking" | "memory" | "tool" | "generating" | "workflow";
}

export function getStatusIcon(type: GenerationStatus["type"]) {
  switch (type) {
    case "memory":
      return <Sparkles className="h-3.5 w-3.5" />;

    case "tool":
      return <Wrench className="h-3.5 w-3.5" />;

    case "thinking":
    case "generating":
    case "workflow":
    default:
      return <Sparkles className="h-3.5 w-3.5" />;
  }
}
