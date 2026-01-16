import { createSupabaseClient } from "./supabase.ts";
import type { User } from "@supabase/supabase-js";
import type { Database } from "./database.types.ts";

export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];

export interface AuthUser {
  user: User;
  profile: UserProfile;
  session: {
    accessToken: string;
  };
}

// Extract session from cookies
export async function getSession(
  req: Request,
): Promise<{ user: User; accessToken: string } | null> {
  const cookies = req.headers.get("cookie");
  if (!cookies) return null;

  const accessToken = getCookie(cookies, "sb-access-token");
  const refreshToken = getCookie(cookies, "sb-refresh-token");

  if (!accessToken || !refreshToken) return null;

  const supabase = createSupabaseClient(accessToken);

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return { user: data.user, accessToken };
}

// Get user profile from database
export async function getUserProfile(
  userId: string,
  accessToken?: string,
): Promise<UserProfile | null> {
  const supabase = createSupabaseClient(accessToken);

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

// Get authenticated user with profile
export async function getAuthUser(req: Request): Promise<AuthUser | null> {
  const session = await getSession(req);
  if (!session) return null;

  const profile = await getUserProfile(session.user.id, session.accessToken);
  if (!profile) return null;

  return {
    user: session.user,
    profile,
    session,
  };
}

// Helper to parse cookies
function getCookie(cookies: string, name: string): string | null {
  const value = `; ${cookies}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookie = parts.pop()?.split(";").shift();
    return cookie || null;
  }
  return null;
}

// Set auth cookies
export function setAuthCookies(
  headers: Headers,
  accessToken: string,
  refreshToken: string,
): void {
  const maxAge = 60 * 60 * 24 * 7; // 7 days

  headers.append(
    "Set-Cookie",
    `sb-access-token=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`,
  );
  headers.append(
    "Set-Cookie",
    `sb-refresh-token=${refreshToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`,
  );
}

// Clear auth cookies
export function clearAuthCookies(headers: Headers): void {
  headers.append(
    "Set-Cookie",
    "sb-access-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
  );
  headers.append(
    "Set-Cookie",
    "sb-refresh-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
  );
}

// Check if user has superadmin role
export function isSuperAdmin(profile: UserProfile): boolean {
  return profile.role === "superadmin";
}
