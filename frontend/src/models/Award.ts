export type AwardCategory = "BRONZE" | "SILVER" | "GOLD";

export interface Award {
  category: AwardCategory;
  title: string;
  description: string;
  completed: boolean;
}
