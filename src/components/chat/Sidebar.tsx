"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

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
  User,
  X,
} from "lucide-react";

import { authClient } from "@/lib/authentication/auth-client";

export interface Conversation {
  id: string;
  title: string;
  updatedAt?: string;
}

interface SidebarProps {
  conversations?: Conversation[];
}

export default function Sidebar({ conversations = [] }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
    setIsProfileOpen(false);
  };

  const handleNewChat = () => {
    closeMobileSidebar();
    router.push("/chat");
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await authClient.signOut();

      closeMobileSidebar();

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
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
          aria-label="New chat"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8f999b] transition-colors hover:bg-[#161a1a] hover:text-[#edf5fc]"
        >
          <Plus size={19} strokeWidth={1.8} />
        </button>
      </div>

      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-dvh flex-col
          border-r border-[#414949]
          bg-[#0b0d0d]
          text-[#edf5fc]

          transition-[width,transform] duration-300 ease-in-out

          w-70

          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}

          md:relative
          md:translate-x-0

          ${isCollapsed ? "md:w-16" : "md:w-70"}
        `}
      >
        <div
          className={`
            flex h-16 shrink-0 items-center border-b border-[#1f2424]
            ${isCollapsed ? "justify-center px-2" : "justify-between px-4"}
          `}
        >
          {!isCollapsed && (
            <Link
              href="/chat"
              onClick={closeMobileSidebar}
              className="group flex min-w-0 items-center gap-3"
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
          )}

          <button
            type="button"
            onClick={() => {
              setIsCollapsed((value) => !value);
              setIsProfileOpen(false);
            }}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`
              hidden h-8 w-8 shrink-0 items-center justify-center
              rounded-lg
              text-[#697171]
              transition-colors
              hover:bg-[#161a1a]
              hover:text-[#edf5fc]
              md:flex
            `}
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

        <div
          className={`
            shrink-0 px-3 pt-3
            ${isCollapsed ? "md:px-2" : ""}
          `}
        >
          <button
            type="button"
            onClick={handleNewChat}
            title={isCollapsed ? "New chat" : undefined}
            className={`
              flex h-10 w-full items-center
              rounded-xl
              border border-[#414949]
              bg-[#161a1a]
              text-sm font-medium
              text-[#edf5fc]
              transition-colors
              hover:border-[#596262]
              hover:bg-[#303737]

              ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"}
            `}
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#23ce6b] text-[#0b0d0d]">
              <Plus size={15} strokeWidth={2.5} />
            </div>

            {!isCollapsed && <span>New chat</span>}
          </button>
        </div>

        {/* SEARCH */}

        {!isCollapsed && (
          <div className="shrink-0 px-3 pt-3">
            <button
              type="button"
              className="flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm text-[#7f8585] transition-colors hover:bg-[#161a1a] hover:text-[#aeb7ba]"
            >
              <Search size={16} strokeWidth={1.8} />

              <span>Search conversations</span>
            </button>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 pt-5">
          {!isCollapsed && (
            <>
              <div className="mb-2 px-2">
                <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#5f6666]">
                  Conversations
                </span>
              </div>

              {conversations.length === 0 ? (
                <EmptyConversations />
              ) : (
                <div className="space-y-1">
                  {conversations.map((conversation) => (
                    <ConversationItem
                      key={conversation.id}
                      conversation={conversation}
                      isActive={pathname === `/chat/${conversation.id}`}
                      onNavigate={closeMobileSidebar}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div
          className={`
            relative shrink-0 border-t border-[#303737] p-3
            ${isCollapsed ? "md:px-2" : ""}
          `}
        >
          {!isCollapsed && isProfileOpen && (
            <ProfileMenu
              userName={userName}
              userEmail={userEmail}
              userInitial={userInitial}
              isLoggingOut={isLoggingOut}
              onLogout={handleLogout}
              onNavigate={closeMobileSidebar}
            />
          )}

          <button
            type="button"
            onClick={() => {
              if (isCollapsed) return;

              setIsProfileOpen((value) => !value);
            }}
            title={isCollapsed ? userName : undefined}
            className={`
              flex h-10 w-full items-center rounded-xl
              transition-colors
              hover:bg-[#161a1a]

              ${isCollapsed ? "justify-center" : "gap-3 px-2"}
            `}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#303737] text-sm font-semibold text-[#23ce6b]">
              {userInitial}
            </div>

            {!isCollapsed && (
              <>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-medium text-[#edf5fc]">
                    {userName}
                  </p>

                  <p className="truncate text-xs text-[#697171]">{userEmail}</p>
                </div>

                <ChevronUp
                  size={16}
                  strokeWidth={1.8}
                  className={`
                    shrink-0 text-[#697171]
                    transition-transform duration-200
                    ${isProfileOpen ? "rotate-180" : ""}
                  `}
                />
              </>
            )}
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
}

function ConversationItem({
  conversation,
  isActive,
  onNavigate,
}: ConversationItemProps) {
  return (
    <div
      className={`
        group flex h-10 w-full items-center rounded-lg
        text-sm transition-colors
        ${
          isActive
            ? "bg-[#303737] text-[#edf5fc]"
            : "text-[#8f999b] hover:bg-[#161a1a] hover:text-[#edf5fc]"
        }
      `}
    >
      <Link
        href={`/chat/${conversation.id}`}
        onClick={onNavigate}
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
        }}
        className="mr-1 hidden shrink-0 rounded-md p-1 text-[#697171] hover:bg-[#414949] hover:text-[#edf5fc] group-hover:block"
        aria-label="Conversation options"
      >
        <MoreHorizontal size={15} strokeWidth={1.8} />
      </button>
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
  icon: React.ComponentType<{
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
