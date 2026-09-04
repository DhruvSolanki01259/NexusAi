"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";
import {
  ChevronUp,
  LogOut,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Trash2,
  User,
  X,
} from "lucide-react";
import { authClient } from "@/lib/authentication/auth-client";
import { getSessionClient } from "@/lib/authentication/session-client";

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

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationAction, setConversationAction] =
    useState<ConversationAction>(null);

  const user = getSessionClient();
  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    let isMounted = true;

    const loadConversations = async () => {
      try {
        const response = await fetch("/api/conversations", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }

        const result = await response.json();

        if (isMounted) {
          setConversations(Array.isArray(result?.data) ? result.data : []);
        }
      } catch (error) {
        console.error("Failed to load conversations:", error);

        if (isMounted) {
          setConversations([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingConversations(false);
        }
      }
    };

    void loadConversations();

    return () => {
      isMounted = false;
    };
  }, []);

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
    setIsProfileOpen(false);
  };

  const closeAllMenus = () => {
    setIsProfileOpen(false);
    setConversationAction(null);
  };

  const handleNewChat = async () => {
    if (isCreatingConversation) return;

    closeAllMenus();

    const latestConversation = conversations[0];

    if (latestConversation?.title === "New Conversation") {
      closeMobileSidebar();
      router.push(`/chat/${latestConversation._id}`);
      return;
    }

    try {
      setIsCreatingConversation(true);

      const response = await fetch("/api/conversations", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create new conversation");
      }

      const result = await response.json();
      const newConversation = result?.data;

      if (!newConversation?._id) {
        throw new Error("Invalid conversation returned from server");
      }

      setConversations((prev) => [newConversation, ...prev]);
      closeMobileSidebar();
      router.push(`/chat/${newConversation._id}`);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const handleRenameConversation = async (
    conversationId: string,
    newTitle: string,
  ) => {
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      throw new Error("Conversation title cannot be empty");
    }

    const response = await fetch(`/api/conversations/${conversationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: trimmedTitle,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to rename conversation");
    }

    const result = await response.json();
    const updatedConversation = result?.data;

    if (!updatedConversation?._id) {
      throw new Error("Invalid conversation returned from server");
    }

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation._id === conversationId
          ? updatedConversation
          : conversation,
      ),
    );
  };

  const handleDeleteConversation = async (conversationId: string) => {
    const response = await fetch(`/api/conversations/${conversationId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete conversation");
    }

    setConversations((prev) =>
      prev.filter((conversation) => conversation._id !== conversationId),
    );

    setConversationAction(null);

    if (pathname === `/chat/${conversationId}`) {
      router.push("/chat");
      router.refresh();
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      closeAllMenus();
      setIsMobileOpen(false);

      await authClient.signOut();

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const openRenameModal = (conversation: Conversation) => {
    setIsProfileOpen(false);
    setConversationAction({
      type: "rename",
      conversation,
    });
  };

  const openDeleteModal = (conversation: Conversation) => {
    setIsProfileOpen(false);
    setConversationAction({
      type: "delete",
      conversation,
    });
  };

  const closeConversationModal = () => {
    setConversationAction(null);
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-[#303737] bg-[#0b0d0d] px-3 md:hidden">
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open sidebar"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8f999b] transition-colors hover:bg-[#161a1a] hover:text-[#edf5fc]"
        >
          <Menu size={20} strokeWidth={1.8} />
        </button>

        <Link href="/chat" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#23ce6b] text-xs font-bold text-[#0b0d0d]">
            N
          </div>
          <span className="text-sm font-semibold tracking-tight text-[#edf5fc]">
            NEXUS AI
          </span>
        </Link>

        <button
          type="button"
          onClick={handleNewChat}
          disabled={isCreatingConversation}
          aria-label="New chat"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8f999b] transition-colors hover:bg-[#161a1a] hover:text-[#edf5fc] disabled:pointer-events-none disabled:opacity-50"
        >
          <Plus size={19} strokeWidth={1.8} />
        </button>
      </div>

      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 cursor-default bg-black/60 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-70 flex-col border-r border-[#414949] bg-[#0b0d0d] text-[#edf5fc] transition-[width,transform] duration-300 ease-in-out ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 ${isCollapsed ? "md:w-16" : "md:w-70"}`}
      >
        <div
          className={`flex h-16 shrink-0 items-center border-b border-[#1f2424] ${isCollapsed ? "justify-center px-2 md:justify-center" : "justify-between px-4"}`}
        >
          <Link
            href="/chat"
            onClick={closeMobileSidebar}
            className={`group flex min-w-0 items-center gap-3 ${isCollapsed ? "md:hidden" : "flex"}`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#23ce6b] text-sm font-bold text-[#0b0d0d] transition-transform duration-200 group-hover:scale-105">
              N
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-[#edf5fc]">
                NEXUS AI
              </p>
              <p className="truncate text-[10px] text-[#697171]">
                Memory. Reasoning. Tools.
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => {
              setIsCollapsed((value) => !value);
              closeAllMenus();
            }}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#697171] transition-colors hover:bg-[#161a1a] hover:text-[#edf5fc] md:flex"
          >
            {isCollapsed ? (
              <Menu size={18} strokeWidth={1.8} />
            ) : (
              <X size={18} strokeWidth={1.8} />
            )}
          </button>

          <button
            type="button"
            onClick={closeMobileSidebar}
            aria-label="Close sidebar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#697171] transition-colors hover:bg-[#161a1a] hover:text-[#edf5fc] md:hidden"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        <div className={`shrink-0 px-3 pt-3 ${isCollapsed ? "md:px-2" : ""}`}>
          <button
            type="button"
            onClick={handleNewChat}
            disabled={isCreatingConversation}
            title={isCollapsed ? "New chat" : undefined}
            className={`flex h-10 w-full items-center rounded-xl border border-[#414949] bg-[#161a1a] text-sm font-medium text-[#edf5fc] transition-colors hover:border-[#596262] hover:bg-[#303737] disabled:cursor-not-allowed disabled:opacity-50 ${isCollapsed ? "justify-center px-0 md:justify-center" : "gap-3 px-3"}`}
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#23ce6b] text-[#0b0d0d]">
              <Plus size={15} strokeWidth={2.5} />
            </div>
            <span className={isCollapsed ? "md:hidden" : ""}>
              {isCreatingConversation ? "Creating..." : "New chat"}
            </span>
          </button>
        </div>

        <div className={`shrink-0 px-3 pt-3 ${isCollapsed ? "md:hidden" : ""}`}>
          <button
            type="button"
            className="flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm text-[#7f8585] transition-colors hover:bg-[#161a1a] hover:text-[#aeb7ba]"
          >
            <Search size={16} strokeWidth={1.8} />
            <span>Search conversations</span>
          </button>
        </div>

        <div
          className={`min-h-0 flex-1 overflow-y-auto px-3 pb-3 pt-5 ${isCollapsed ? "md:hidden" : ""}`}
        >
          <div className="mb-2 px-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#5f6666]">
              Conversations
            </span>
          </div>

          {isLoadingConversations ? (
            <div className="space-y-1">
              <div className="h-10 animate-pulse rounded-lg bg-[#111515]" />
              <div className="h-10 animate-pulse rounded-lg bg-[#111515]" />
              <div className="h-10 animate-pulse rounded-lg bg-[#111515]" />
            </div>
          ) : conversations.length === 0 ? (
            <EmptyConversations />
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <ConversationItem
                  key={conversation._id}
                  conversation={conversation}
                  isActive={pathname === `/chat/${conversation._id}`}
                  onNavigate={closeMobileSidebar}
                  onRename={openRenameModal}
                  onDelete={openDeleteModal}
                  activeAction={
                    conversationAction?.conversation._id === conversation._id
                      ? conversationAction.type
                      : null
                  }
                />
              ))}
            </div>
          )}
        </div>

        {conversationAction && (
          <div className={isCollapsed ? "md:hidden" : ""}>
            <ConversationActionPanel
              key={`${conversationAction.type}-${conversationAction.conversation._id}`}
              action={conversationAction}
              onClose={closeConversationModal}
              onRename={handleRenameConversation}
              onDelete={handleDeleteConversation}
            />
          </div>
        )}

        <div
          className={`relative shrink-0 border-t border-[#303737] p-3 ${isCollapsed ? "md:px-2" : ""}`}
        >
          {isProfileOpen && (
            <div className={isCollapsed ? "md:hidden" : ""}>
              <ProfileMenu
                userName={userName}
                userEmail={userEmail}
                userInitial={userInitial}
                isLoggingOut={isLoggingOut}
                onLogout={handleLogout}
                onNavigate={closeMobileSidebar}
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setConversationAction(null);
              setIsProfileOpen((value) => !value);
            }}
            title={isCollapsed ? userName : undefined}
            className={`flex h-10 w-full items-center rounded-xl transition-colors hover:bg-[#161a1a] ${isCollapsed ? "justify-center md:justify-center" : "gap-3 px-2"}`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#303737] text-sm font-semibold text-[#23ce6b]">
              {userInitial}
            </div>

            <div
              className={`min-w-0 flex-1 text-left ${isCollapsed ? "md:hidden" : ""}`}
            >
              <p className="truncate text-sm font-medium text-[#edf5fc]">
                {userName}
              </p>
              <p className="truncate text-xs text-[#697171]">{userEmail}</p>
            </div>

            <ChevronUp
              size={16}
              strokeWidth={1.8}
              className={`shrink-0 text-[#697171] transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""} ${isCollapsed ? "md:hidden" : ""}`}
            />
          </button>
        </div>
      </aside>
    </>
  );
}

function EmptyConversations() {
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

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onNavigate: () => void;
  onRename: (conversation: Conversation) => void;
  onDelete: (conversation: Conversation) => void;
  activeAction: "rename" | "delete" | null;
}

function ConversationItem({
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
      className={`group relative flex h-10 w-full items-center rounded-lg text-sm transition-colors ${isActive ? "bg-[#303737] text-[#edf5fc]" : "text-[#8f999b] hover:bg-[#161a1a] hover:text-[#edf5fc]"} ${isActionOpen ? "ring-1 ring-[#414949]" : ""}`}
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
        className={`mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#697171] transition-all hover:bg-[#414949] hover:text-[#edf5fc] ${isMenuOpen ? "bg-[#414949] text-[#edf5fc] opacity-100" : "opacity-0 group-hover:opacity-100 focus:opacity-100"}`}
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

function ConversationActionPanel({
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

function ProfileMenu({
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

function ProfileMenuItem({
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