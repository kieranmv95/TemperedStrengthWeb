export type PortalUserType = "ADMIN" | "LEADERBOARD_ACCESS";

export type PortalProfile = {
  id: string;
  display_name: string | null;
  user_type: PortalUserType | null;
  created_at: string;
};
