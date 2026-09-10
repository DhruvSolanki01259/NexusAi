"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ChevronUp, Menu, Plus, Search, X } from "lucide-react";
import { authClient } from "@/lib/authentication/auth-client";
import { getSessionClient } from "@/lib/authentication/session-client";
import {
  ConversationActionPanel,
  ConversationItem,
  EmptyConversations,
  NoSearchResults,
  ProfileMenu,
} from "./SidebarUtils";
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
interface ConversationTitleUpdatedDetail {
  conversationId?: string;
  title?: string;
}
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
  const [searchQuery, setSearchQuery] = useState("");
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
  const persistConversationTitle = useCallback(
    async (conversationId: string, newTitle: string) => {
      const trimmedTitle = newTitle.trim();
      if (!conversationId || !trimmedTitle) {
        return;
      }
      try {
        const response = await fetch(
          `/api/conversations/${encodeURIComponent(conversationId)}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: trimmedTitle,
            }),
          },
        );
        if (!response.ok) {
          let message = "Failed to persist conversation title.";
          try {
            const errorPayload = await response.json();
            message = errorPayload?.message || errorPayload?.error || message;
          } catch {}
          throw new Error(message);
        }
        const result = await response.json();
        const updatedConversation = result?.data;
        if (updatedConversation?._id) {
          setConversations((previous) =>
            previous.map((conversation) =>
              conversation._id === conversationId
                ? {
                    ...conversation,
                    ...updatedConversation,
                    title: updatedConversation.title?.trim() || trimmedTitle,
                  }
                : conversation,
            ),
          );
        }
      } catch (error) {
        console.error("[Sidebar] Failed to persist conversation title:", error);
      }
    },
    [],
  );
  useEffect(() => {
    const handleConversationTitleUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<ConversationTitleUpdatedDetail>;
      const conversationId = customEvent.detail?.conversationId?.trim();
      const newTitle = customEvent.detail?.title?.trim();
      if (!conversationId || !newTitle) {
        console.warn(
          "[Sidebar] Invalid conversation title event:",
          customEvent.detail,
        );
        return;
      }
      console.log("[Sidebar] Conversation title event received:", {
        conversationId,
        title: newTitle,
      });
      setConversations((previous) =>
        previous.map((conversation) =>
          conversation._id === conversationId
            ? {
                ...conversation,
                title: newTitle,
              }
            : conversation,
        ),
      );
      void persistConversationTitle(conversationId, newTitle);
    };
    window.addEventListener(
      "conversation-title-updated",
      handleConversationTitleUpdated,
    );
    return () => {
      window.removeEventListener(
        "conversation-title-updated",
        handleConversationTitleUpdated,
      );
    };
  }, [persistConversationTitle]);
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredConversations = normalizedSearchQuery
    ? conversations.filter((conversation) =>
        conversation.title.toLowerCase().includes(normalizedSearchQuery),
      )
    : conversations;
  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
    setIsProfileOpen(false);
  };
  const closeAllMenus = () => {
    setIsProfileOpen(false);
    setConversationAction(null);
  };
  const handleNewChat = async () => {
    if (isCreatingConversation) {
      return;
    }
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
      setConversations((previous) => [newConversation, ...previous]);
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
    const response = await fetch(
      `/api/conversations/${encodeURIComponent(conversationId)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle,
        }),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to rename conversation");
    }
    const result = await response.json();
    const updatedConversation = result?.data;
    if (!updatedConversation?._id) {
      throw new Error("Invalid conversation returned from server");
    }
    setConversations((previous) =>
      previous.map((conversation) =>
        conversation._id === conversationId
          ? updatedConversation
          : conversation,
      ),
    );
  };
  const handleDeleteConversation = async (conversationId: string) => {
    try {
      const messagesResponse = await fetch(
        `/api/messages/${encodeURIComponent(conversationId)}`,
        {
          method: "DELETE",
        },
      );
      if (!messagesResponse.ok) {
        const errorData = await messagesResponse.json().catch(() => null);
        throw new Error(
          errorData?.message || "Failed to delete conversation messages",
        );
      }
      const conversationResponse = await fetch(
        `/api/conversations/${encodeURIComponent(conversationId)}`,
        {
          method: "DELETE",
        },
      );
      if (!conversationResponse.ok) {
        const errorData = await conversationResponse.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to delete conversation");
      }
      setConversations((previous) =>
        previous.filter((conversation) => conversation._id !== conversationId),
      );
      setConversationAction(null);
      if (pathname === `/chat/${conversationId}`) {
        router.push("/chat");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };
  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }
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
      {}
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
      {}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh min-h-0 w-70 flex-col border-r border-[#414949] bg-[#0b0d0d] text-[#edf5fc] transition-[width,transform] duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:sticky md:top-0 md:h-dvh md:min-h-0 md:translate-x-0 ${
          isCollapsed ? "md:w-16" : "md:w-70"
        }`}
      >
        {}
        <div
          className={`flex h-16 shrink-0 items-center border-b border-[#1f2424] ${
            isCollapsed
              ? "justify-center px-2 md:justify-center"
              : "justify-between px-4"
          }`}
        >
          <Link
            href="/chat"
            onClick={closeMobileSidebar}
            className={`group flex min-w-0 items-center gap-3 ${
              isCollapsed ? "md:hidden" : "flex"
            }`}
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
        {}
        <div className={`shrink-0 px-3 pt-3 ${isCollapsed ? "md:px-2" : ""}`}>
          <button
            type="button"
            onClick={handleNewChat}
            disabled={isCreatingConversation}
            title={isCollapsed ? "New chat" : undefined}
            className={`flex h-10 w-full items-center rounded-xl border border-[#414949] bg-[#161a1a] text-sm font-medium text-[#edf5fc] transition-colors hover:border-[#596262] hover:bg-[#303737] disabled:cursor-not-allowed disabled:opacity-50 ${
              isCollapsed
                ? "justify-center px-0 md:justify-center"
                : "gap-3 px-3"
            }`}
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#23ce6b] text-[#0b0d0d]">
              <Plus size={15} strokeWidth={2.5} />
            </div>
            <span className={isCollapsed ? "md:hidden" : ""}>
              {isCreatingConversation ? "Creating..." : "New chat"}
            </span>
          </button>
        </div>
        {}
        <div className={`shrink-0 px-3 pt-3 ${isCollapsed ? "md:hidden" : ""}`}>
          <div className="relative">
            <Search
              size={16}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#697171]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search conversations"
              aria-label="Search conversations"
              className="h-9 w-full rounded-lg border border-transparent bg-[#111515] pl-9 pr-3 text-sm text-[#edf5fc] outline-none transition-colors placeholder:text-[#5f6666] focus:border-[#414949] focus:bg-[#161a1a]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[#697171] transition-colors hover:bg-[#303737] hover:text-[#edf5fc]"
              >
                <X size={14} strokeWidth={1.8} />
              </button>
            )}
          </div>
        </div>
        {}
        <div
          className={`min-h-0 flex-1 overflow-y-auto px-3 pb-3 pt-5 ${
            isCollapsed ? "md:hidden" : ""
          }`}
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
          ) : filteredConversations.length === 0 ? (
            <NoSearchResults searchQuery={searchQuery} />
          ) : (
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
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
        {}
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
        {}
        <div
          className={`relative mt-auto shrink-0 border-t border-[#303737] p-3 ${
            isCollapsed ? "md:px-2" : ""
          }`}
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
            className={`flex h-10 w-full items-center rounded-xl transition-colors hover:bg-[#161a1a] ${
              isCollapsed ? "justify-center md:justify-center" : "gap-3 px-2"
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#303737] text-sm font-semibold text-[#23ce6b]">
              {userInitial}
            </div>
            <div
              className={`min-w-0 flex-1 text-left ${
                isCollapsed ? "md:hidden" : ""
              }`}
            >
              <p className="truncate text-sm font-medium text-[#edf5fc]">
                {userName}
              </p>
              <p className="truncate text-xs text-[#697171]">{userEmail}</p>
            </div>
            <ChevronUp
              size={16}
              strokeWidth={1.8}
              className={`shrink-0 text-[#697171] transition-transform duration-200 ${
                isProfileOpen ? "rotate-180" : ""
              } ${isCollapsed ? "md:hidden" : ""}`}
            />
          </button>
        </div>
      </aside>
    </>
  );
}
