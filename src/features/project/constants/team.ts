import { TeamItem } from "@/features/auth/types";
import dayjs from "dayjs";

export const DEFAULT_TEAM: TeamItem = {
  name: "okapi",
  team_id: "-1",
  is_team_admin: 1,
  is_default: 1,
  is_readonly: 0,
  created_at: dayjs().toDate(),
  project: null,
  upgrade_status: 0,
};
