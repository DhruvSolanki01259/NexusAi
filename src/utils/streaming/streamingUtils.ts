interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

interface MessagesResponse {
  data?: unknown;
  id?: string;
  title?: string;
  messages?: unknown;
  conversation?: {
    id?: string;
    title?: string;
    messages?: unknown;
  };
}

interface GenerationStatus {
  node: string;
  message: string;
  type: "thinking" | "memory" | "tool" | "generating" | "workflow";
}

export interface ChatStreamEvent {
  type: "token" | "status" | "title" | "done" | "error";
  content?: string;
  node?: string;
  message?: string;
  conversationId?: string;
  title?: string;
  code?: string;
  retryAfter?: number;
}

const INITIAL_TITLE = "New Conversation";

export function createMessageId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `message-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function formatNodeName(node: string) {
  return node
    .replace(/[\\_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatMessageDate(value?: string) {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function getCurrentMessageDate() {
  return formatMessageDate(new Date().toISOString());
}

export function getNodeStatus(node: string): GenerationStatus {
  const normalized = node.toLowerCase();

  if (
    normalized.includes("memory") ||
    normalized.includes("retrieve") ||
    normalized.includes("retrieval") ||
    normalized.includes("search")
  ) {
    return {
      node,
      message: "Searching memory",
      type: "memory",
    };
  }

  if (
    normalized.includes("tool") ||
    normalized.includes("browser") ||
    normalized.includes("api") ||
    normalized.includes("web")
  ) {
    return {
      node,
      message: "Using tools",
      type: "tool",
    };
  }

  if (
    normalized.includes("reason") ||
    normalized.includes("think") ||
    normalized.includes("agent") ||
    normalized.includes("planner") ||
    normalized.includes("planning")
  ) {
    return {
      node,
      message: "Thinking",
      type: "thinking",
    };
  }

  if (
    normalized.includes("model") ||
    normalized.includes("llm") ||
    normalized.includes("generate") ||
    normalized.includes("response")
  ) {
    return {
      node,
      message: "Generating response",
      type: "generating",
    };
  }

  return {
    node,
    message: formatNodeName(node),
    type: "workflow",
  };
}

export function normalizeMessage(
  message: unknown,
  index: number,
): Message | null {
  if (!message || typeof message !== "object") {
    return null;
  }

  const raw = message as Record<string, unknown>;

  const role = raw.role;
  if (role !== "user" && role !== "assistant") {
    console.warn(
      `[Messages GET] Ignoring message with invalid role at index ${index}`,
    );
    return null;
  }

  let content = "";
  if (typeof raw.content === "string") {
    content = raw.content;
  } else if (typeof raw.text === "string") {
    content = raw.text;
  } else if (typeof raw.message === "string") {
    content = raw.message;
  }

  let id: string;
  if (typeof raw.id === "string") {
    id = raw.id;
  } else if (typeof raw._id === "string") {
    id = raw._id;
  } else if (
    raw._id &&
    typeof raw._id === "object" &&
    "$oid" in raw._id &&
    typeof (
      raw._id as {
        $oid?: unknown;
      }
    ).$oid === "string"
  ) {
    id = (
      raw._id as {
        $oid: string;
      }
    ).$oid;
  } else {
    id = `message-${index}`;
  }

  let rawCreatedAt: string | undefined;
  if (typeof raw.createdAt === "string") {
    rawCreatedAt = raw.createdAt;
  } else if (raw.createdAt instanceof Date) {
    rawCreatedAt = raw.createdAt.toISOString();
  } else if (
    raw.createdAt &&
    typeof raw.createdAt === "object" &&
    "$date" in raw.createdAt &&
    typeof (
      raw.createdAt as {
        $date?: unknown;
      }
    ).$date === "string"
  ) {
    rawCreatedAt = (
      raw.createdAt as {
        $date: string;
      }
    ).$date;
  }

  return {
    id,
    role,
    content,
    createdAt: formatMessageDate(rawCreatedAt),
  };
}

export function normalizeMessages(messages: unknown): Message[] {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .map((message, index) => normalizeMessage(message, index))
    .filter((message): message is Message => message !== null);
}

export function extractMessagesFromResponse(
  payload: MessagesResponse,
): unknown[] {
  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload.messages)) {
    return payload.messages;
  }

  if (Array.isArray(payload.conversation?.messages)) {
    return payload.conversation.messages;
  }

  if (
    payload.data &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data)
  ) {
    const data = payload.data as Record<string, unknown>;

    if (Array.isArray(data.messages)) {
      return data.messages;
    }

    if (data.conversation && typeof data.conversation === "object") {
      const conversation = data.conversation as Record<string, unknown>;
      if (Array.isArray(conversation.messages)) {
        return conversation.messages;
      }
    }
  }

  return [];
}

export function extractConversationTitle(payload: MessagesResponse): string {
  if (typeof payload.title === "string" && payload.title.trim()) {
    return payload.title.trim();
  }

  if (
    typeof payload.conversation?.title === "string" &&
    payload.conversation.title.trim()
  ) {
    return payload.conversation.title.trim();
  }

  if (
    payload.data &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data)
  ) {
    const data = payload.data as Record<string, unknown>;

    if (typeof data.title === "string" && data.title.trim()) {
      return data.title.trim();
    }

    if (data.conversation && typeof data.conversation === "object") {
      const conversation = data.conversation as Record<string, unknown>;
      if (typeof conversation.title === "string" && conversation.title.trim()) {
        return conversation.title.trim();
      }
    }
  }

  return INITIAL_TITLE;
}

export function parseStreamLine(line: string): ChatStreamEvent | null {
  const trimmed = line.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);

    if (!parsed || typeof parsed !== "object") {
      console.warn("[Chat Stream] Ignoring malformed event:", parsed);
      return null;
    }

    const event = parsed as Record<string, unknown>;

    if (
      event.type !== "token" &&
      event.type !== "status" &&
      event.type !== "title" &&
      event.type !== "done" &&
      event.type !== "error"
    ) {
      console.warn("[Chat Stream] Ignoring unknown event:", event);
      return null;
    }

    let retryAfter: number | undefined;
    if (
      typeof event.retryAfter === "number" &&
      Number.isFinite(event.retryAfter) &&
      event.retryAfter > 0
    ) {
      retryAfter = event.retryAfter;
    }

    const streamEvent: ChatStreamEvent = {
      type: event.type as ChatStreamEvent["type"],
      content: typeof event.content === "string" ? event.content : undefined,
      node: typeof event.node === "string" ? event.node : undefined,
      message: typeof event.message === "string" ? event.message : undefined,
      conversationId:
        typeof event.conversationId === "string"
          ? event.conversationId
          : undefined,
      title: typeof event.title === "string" ? event.title : undefined,
      code: typeof event.code === "string" ? event.code : undefined,
      retryAfter,
    };

    return streamEvent;
  } catch (error) {
    console.warn("[Chat Stream] Failed to parse NDJSON line:", error);
    return null;
  }
}
