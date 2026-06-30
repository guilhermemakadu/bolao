import { describe, expect, it, vi, beforeEach } from "vitest";

const {
  mockSelect,
  mockInsert,
  mockUpdate,
  mockDelete,
  mockFrom,
  mockWhere,
  mockLimit,
  mockValues,
  mockReturning,
  mockSet,
} = vi.hoisted(() => ({
  mockSelect: vi.fn(),
  mockInsert: vi.fn(),
  mockUpdate: vi.fn(),
  mockDelete: vi.fn(),
  mockFrom: vi.fn(),
  mockWhere: vi.fn(),
  mockLimit: vi.fn(),
  mockValues: vi.fn(),
  mockReturning: vi.fn(),
  mockSet: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: {
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
  },
}));

vi.mock("crypto", () => ({
  randomUUID: vi.fn(() => "550e8400-e29b-41d4-a716-446655440000"),
}));

import {
  BolaoServiceError,
  completeBolao,
  createDraftBolao,
  deleteBolao,
  updateOpenBolaoRules,
} from "@/services/boloes";

const COMPETITION_ID = "a0000000-0000-4000-8000-000000000001";
const CREATOR_ID = "user-creator-1";
const POOL_ID = "pool-1";

const DRAFT_POOL = {
  id: POOL_ID,
  creatorId: CREATOR_ID,
  competitionId: COMPETITION_ID,
  name: "",
  description: null,
  slugToken: "550e8400-e29b-41d4-a716-446655440000",
  status: "DRAFT",
  rulesJson: {
    modes: { exactScore: true, result: false, tournamentExtras: false },
    points: { exactScore: 5, result: 3, champion: 10, topScorer: 10 },
    tiebreaker: "most_exact_scores",
  },
  startedAt: null,
  archivedAt: null,
  createdAt: new Date("2026-06-30"),
  updatedAt: new Date("2026-06-30"),
};

describe("createDraftBolao", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockLimit.mockResolvedValue([{ id: COMPETITION_ID, name: "Brasileirão Série A" }]);
    mockWhere.mockReturnValue({ limit: mockLimit });
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    mockReturning.mockResolvedValue([DRAFT_POOL]);
    mockValues.mockReturnValue({ returning: mockReturning });
    mockInsert.mockReturnValue({ values: mockValues });
  });

  it("creates a DRAFT pool with slug token and adds creator as member", async () => {
    const pool = await createDraftBolao(CREATOR_ID, COMPETITION_ID);

    expect(pool.status).toBe("DRAFT");
    expect(pool.slugToken).toBe("550e8400-e29b-41d4-a716-446655440000");
    expect(mockInsert).toHaveBeenCalledTimes(2);
    expect(mockValues).toHaveBeenCalledWith(
      expect.objectContaining({
        creatorId: CREATOR_ID,
        competitionId: COMPETITION_ID,
        status: "DRAFT",
        slugToken: "550e8400-e29b-41d4-a716-446655440000",
      }),
    );
    expect(mockValues).toHaveBeenCalledWith(
      expect.objectContaining({
        poolId: POOL_ID,
        userId: CREATOR_ID,
      }),
    );
  });
});

describe("completeBolao", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLimit.mockResolvedValue([DRAFT_POOL]);
    mockWhere.mockReturnValue({ limit: mockLimit, returning: mockReturning });
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });
    mockReturning.mockResolvedValue([{ ...DRAFT_POOL, name: "Bolão da Firma", status: "OPEN" }]);
    mockSet.mockReturnValue({ where: mockWhere });
    mockUpdate.mockReturnValue({ set: mockSet });
  });

  it("transitions pool from DRAFT to OPEN with name", async () => {
    const pool = await completeBolao(POOL_ID, CREATOR_ID, "Bolão da Firma");

    expect(pool.status).toBe("OPEN");
    expect(pool.name).toBe("Bolão da Firma");
    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Bolão da Firma",
        status: "OPEN",
      }),
    );
  });
});

describe("updateOpenBolaoRules", () => {
  const openPool = { ...DRAFT_POOL, status: "OPEN", name: "Bolão da Firma" };
  const updatedRules = {
    modes: { exactScore: true, result: true, tournamentExtras: false },
    points: { exactScore: 5, result: 3, champion: 10, topScorer: 10 },
    tiebreaker: "most_exact_scores" as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLimit.mockResolvedValue([openPool]);
    mockWhere.mockReturnValue({ limit: mockLimit, returning: mockReturning });
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });
    mockReturning.mockResolvedValue([{ ...openPool, rulesJson: updatedRules }]);
    mockSet.mockReturnValue({ where: mockWhere });
    mockUpdate.mockReturnValue({ set: mockSet });
  });

  it("updates rules when pool is OPEN", async () => {
    const pool = await updateOpenBolaoRules(POOL_ID, CREATOR_ID, updatedRules);
    expect(pool.rulesJson.modes.result).toBe(true);
  });

  it("rejects rule updates when pool is IN_PROGRESS", async () => {
    mockLimit.mockResolvedValue([{ ...openPool, status: "IN_PROGRESS" }]);

    await expect(updateOpenBolaoRules(POOL_ID, CREATOR_ID, updatedRules)).rejects.toThrow(
      BolaoServiceError,
    );
  });
});

describe("deleteBolao", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLimit.mockResolvedValue([{ ...DRAFT_POOL, status: "OPEN" }]);
    mockWhere.mockReturnValue({ limit: mockLimit });
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });
    mockDelete.mockReturnValue({ where: mockWhere });
  });

  it("deletes pool in OPEN status", async () => {
    await deleteBolao(POOL_ID, CREATOR_ID);
    expect(mockDelete).toHaveBeenCalled();
  });

  it("rejects deletion when pool is IN_PROGRESS", async () => {
    mockLimit.mockResolvedValue([{ ...DRAFT_POOL, status: "IN_PROGRESS" }]);

    await expect(deleteBolao(POOL_ID, CREATOR_ID)).rejects.toThrow(BolaoServiceError);
    expect(mockDelete).not.toHaveBeenCalled();
  });
});
