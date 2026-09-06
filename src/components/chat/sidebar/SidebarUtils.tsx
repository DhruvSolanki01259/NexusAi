"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";

import {
  LogOut,
  MessageSquare,
  MoreHorizontal,
  Search,
  Settings,
  SlidersHorizontal,
  Trash2,
  User,
  X,
} from "lucide-react";

export interface Conversation {
  _id: string;
  title: string;
  updatedAt?: string;
}

type ConversationAction =
  | {
      type: "rename";
      conversation: Conversation;
    }
  | {
      type: "delete";
      conversation: Conversation;
    }
  | null;

export function EmptyConversations() {
  return (
    <div className="flex flex-col items-center px-4 py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#414949] bg-[#161a1a]">
        <MessageSquare size={17} strokeWidth={1.7} className="text-[#697171]" />
      </div>

      <p className="mt-4 text-sm font-medium text-[#8f999b]">
        No conversations yet
      </p>

      <p className="mt-1.5 max-w-47.5 text-xs leading-5 text-[#5f6666]">
        Start a new conversation and your chats will appear here.
      </p>
    </div>
  );
}

export function NoSearchResults({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="flex flex-col items-center px-4 py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#414949] bg-[#161a1a]">
        <Search size={17} strokeWidth={1.7} className="text-[#697171]" />
      </div>

      <p className="mt-4 text-sm font-medium text-[#8f999b]">
        No conversations found
      </p>

      <p className="mt-1.5 max-w-47.5 truncate text-xs leading-5 text-[#5f6666]">
        No conversation matches `{searchQuery.trim()}`.
      </p>
    </div>
  );
}

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onNavigate: () => void;
  onRename: (conversation: Conversation) => void;
  onDelete: (conversation: Conversation) => void;
  activeAction: "rename" | "delete" | null;
}

export function ConversationItem({
  conversation,
  isActive,
  onNavigate,
  onRename,
  onDelete,
  activeAction,
}: ConversationItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActionOpen = Boolean(activeAction);

  return (
    <div
      className={`group relative flex h-10 w-full items-center rounded-lg text-sm transition-colors ${
        isActive
          ? "bg-[#303737] text-[#edf5fc]"
          : "text-[#8f999b] hover:bg-[#161a1a] hover:text-[#edf5fc]"
      } ${isActionOpen ? "ring-1 ring-[#414949]" : ""}`}
    >
      <Link
        href={`/chat/${conversation._id}`}
        onClick={() => {
          setIsMenuOpen(false);
          onNavigate();
        }}
        className="flex min-w-0 flex-1 items-center gap-3 px-3"
      >
        <MessageSquare size={16} strokeWidth={1.7} className="shrink-0" />

        <span className="min-w-0 flex-1 truncate">{conversation.title}</span>
      </Link>

      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();

          setIsMenuOpen((value) => !value);
        }}
        aria-label="Conversation options"
        aria-expanded={isMenuOpen}
        className={`mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#697171] transition-all hover:bg-[#414949] hover:text-[#edf5fc] ${
          isMenuOpen
            ? "bg-[#414949] text-[#edf5fc] opacity-100"
            : "opacity-0 group-hover:opacity-100 focus:opacity-100"
        }`}
      >
        <MoreHorizontal size={15} strokeWidth={1.8} />
      </button>

      {isMenuOpen && !isActionOpen && (
        <>
          <button
            type="button"
            aria-label="Close conversation options"
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />

          <div className="absolute right-1 top-full z-50 mt-1 w-40 overflow-hidden rounded-xl border border-[#414949] bg-[#161a1a] p-1 shadow-[0_12px_35px_rgba(0,0,0,0.45)]">
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                setIsMenuOpen(false);
                onRename(conversation);
              }}
              className="flex h-9 w-full items-center rounded-lg px-3 text-left text-sm text-[#aeb7ba] transition-colors hover:bg-[#303737] hover:text-[#edf5fc]"
            >
              Rename
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                setIsMenuOpen(false);
                onDelete(conversation);
              }}
              className="flex h-9 w-full items-center gap-2 rounded-lg px-3 text-left text-sm text-[#d95c5c] transition-colors hover:bg-[#d95c5c]/8"
            >
              <Trash2 size={14} strokeWidth={1.8} />

              <span>Delete</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

interface ConversationActionPanelProps {
  action: Exclude<ConversationAction, null>;
  onClose: () => void;
  onRename: (conversationId: string, newTitle: string) => Promise<void> | void;
  onDelete: (conversationId: string) => Promise<void> | void;
}

export function ConversationActionPanel({
  action,
  onClose,
  onRename,
  onDelete,
}: ConversationActionPanelProps) {
  const [title, setTitle] = useState(action.conversation.title);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRename = action.type === "rename";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSubmitting, onClose]);

  const handleRename = async () => {
    if (isSubmitting) return;

    const trimmedTitle = title.trim();

    if (!trimmedTitle) return;

    if (trimmedTitle === action.conversation.title) {
      onClose();
      return;
    }

    try {
      setIsSubmitting(true);

      await onRename(action.conversation._id, trimmedTitle);

      onClose();
    } catch (error) {
      console.error("Failed to rename conversation:", error);

      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      await onDelete(action.conversation._id);

      onClose();
    } catch (error) {
      console.error("Failed to delete conversation:", error);

      setIsSubmitting(false);
    }
  };

  return (
    <div className="absolute bottom-19 left-3 right-3 z-60 animate-[conversationPanelIn_160ms_ease-out]">
      <div className="overflow-hidden rounded-2xl border border-[#414949] bg-[#161a1a] shadow-[0_18px_50px_rgba(0,0,0,0.55)]">
        <div className="flex items-start justify-between gap-3 border-b border-[#303737] px-4 py-3.5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {isRename ? (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#23ce6b]/10 text-[#23ce6b]">
                  <MessageSquare size={13} strokeWidth={1.8} />
                </div>
              ) : (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#d95c5c]/10 text-[#d95c5c]">
                  <Trash2 size={13} strokeWidth={1.8} />
                </div>
              )}

              <p className="text-xs font-semibold text-[#edf5fc]">
                {isRename ? "Rename conversation" : "Delete conversation"}
              </p>
            </div>

            <p className="mt-1.5 truncate text-[11px] text-[#697171]">
              {action.conversation.title}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Cancel"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#697171] transition-colors hover:bg-[#303737] hover:text-[#edf5fc] disabled:pointer-events-none disabled:opacity-50"
          >
            <X size={15} strokeWidth={1.8} />
          </button>
        </div>

        {/* Rename */}
        {isRename ? (
          <div className="p-4">
            <label
              htmlFor="conversation-title"
              className="mb-1.5 block text-[11px] font-medium text-[#8f999b]"
            >
              Conversation name
            </label>

            <input
              id="conversation-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();

                  void handleRename();
                }

                if (event.key === "Escape") {
                  event.preventDefault();

                  if (!isSubmitting) {
                    onClose();
                  }
                }
              }}
              autoFocus
              maxLength={100}
              disabled={isSubmitting}
              className="h-10 w-full rounded-lg border border-[#414949] bg-[#0b0d0d] px-3 text-sm text-[#edf5fc] outline-none placeholder:text-[#5f6666] transition-colors focus:border-[#23ce6b]/60 disabled:opacity-50"
            />

            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-8 rounded-lg px-3 text-xs font-medium text-[#8f999b] transition-colors hover:bg-[#303737] hover:text-[#edf5fc] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleRename()}
                disabled={isSubmitting || !title.trim()}
                className="h-8 rounded-lg bg-[#23ce6b] px-3 text-xs font-semibold text-[#0b0d0d] transition-all hover:bg-[#32dc79] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Renaming..." : "Rename"}
              </button>
            </div>
          </div>
        ) : (
          /* Delete */
          <div className="p-4">
            <p className="text-xs leading-5 text-[#8f999b]">
              Are you sure you want to delete this conversation? This action
              cannot be undone.
            </p>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-8 rounded-lg px-3 text-xs font-medium text-[#8f999b] transition-colors hover:bg-[#303737] hover:text-[#edf5fc] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={isSubmitting}
                className="h-8 rounded-lg bg-[#d95c5c] px-3 text-xs font-semibold text-[#0b0d0d] transition-colors hover:bg-[#e26f6f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ProfileMenuProps {
  userName: string;
  userEmail: string;
  userInitial: string;
  isLoggingOut: boolean;
  onLogout: () => void;
  onNavigate: () => void;
}

export function ProfileMenu({
  userName,
  userEmail,
  userInitial,
  isLoggingOut,
  onLogout,
  onNavigate,
}: ProfileMenuProps) {
  return (
    <div className="absolute bottom-[calc(100%+8px)] left-3 right-3 z-50 overflow-hidden rounded-2xl border border-[#414949] bg-[#161a1a] shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
      <div className="border-b border-[#303737] p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#303737] text-sm font-semibold text-[#23ce6b]">
            {userInitial}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#edf5fc]">
              {userName}
            </p>

            <p className="truncate text-xs text-[#697171]">{userEmail}</p>
          </div>
        </div>
      </div>

      <div className="p-2">
        <ProfileMenuItem
          icon={SlidersHorizontal}
          label="Personalization"
          route="/profile/settings/personalization"
          onNavigate={onNavigate}
        />

        <ProfileMenuItem
          icon={User}
          label="Profile"
          route="/profile"
          onNavigate={onNavigate}
        />

        <ProfileMenuItem
          icon={Settings}
          label="Settings"
          route="/profile/settings"
          onNavigate={onNavigate}
        />
      </div>

      <div className="border-t border-[#303737] p-2">
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-[#d95c5c] transition-colors hover:bg-[#d95c5c]/8 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogOut size={16} strokeWidth={1.8} />

          <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
        </button>
      </div>
    </div>
  );
}

interface ProfileMenuItemProps {
  icon: ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
  label: string;
  route: string;
  onNavigate: () => void;
}

export function ProfileMenuItem({
  icon: Icon,
  label,
  route,
  onNavigate,
}: ProfileMenuItemProps) {
  const router = useRouter();

  const handleClick = () => {
    onNavigate();
    router.push(route);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-[#8f999b] transition-colors hover:bg-[#303737] hover:text-[#edf5fc]"
    >
      <Icon size={16} strokeWidth={1.8} />

      <span>{label}</span>
    </button>
  );
}
