export type AwardCategory = "BRONZE" | "SILVER" | "GOLD";

export interface Award {
  category: AwardCategory;
  description: string;
  completed: boolean;
}
