import type { BolaoSummary } from "@/components/bolao/bolao-card";

export type UserBoloes = {
  created: BolaoSummary[];
  participating: BolaoSummary[];
};

export async function listUserBoloes(userId: string): Promise<UserBoloes> {
  void userId;
  return { created: [], participating: [] };
}
