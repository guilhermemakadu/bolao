import { describe, expect, it, vi, beforeEach } from "vitest";

const { mockSelect, mockUpdate, mockFrom, mockWhere, mockLimit, mockSet } = vi.hoisted(() => ({
  mockSelect: vi.fn(),
  mockUpdate: vi.fn(),
  mockFrom: vi.fn(),
  mockWhere: vi.fn(),
  mockLimit: vi.fn(),
  mockSet: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: {
    select: mockSelect,
    update: mockUpdate,
  },
}));

import { getUserProfile, updateUserDisplayName } from "@/services/users";

describe("getUserProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLimit.mockResolvedValue([{ id: "user-1", email: "a@b.com", name: "Ana" }]);
    mockWhere.mockReturnValue({ limit: mockLimit });
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });
  });

  it("returns the user row when found", async () => {
    const profile = await getUserProfile("user-1");
    expect(profile).toEqual({ id: "user-1", email: "a@b.com", name: "Ana" });
  });

  it("returns null when user is not found", async () => {
    mockLimit.mockResolvedValue([]);
    const profile = await getUserProfile("missing");
    expect(profile).toBeNull();
  });
});

describe("updateUserDisplayName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWhere.mockResolvedValue(undefined);
    mockSet.mockReturnValue({ where: mockWhere });
    mockUpdate.mockReturnValue({ set: mockSet });
  });

  it("persists trimmed display name", async () => {
    await updateUserDisplayName("user-1", "  Maria  ");
    expect(mockUpdate).toHaveBeenCalled();
    expect(mockSet).toHaveBeenCalledWith({ name: "Maria" });
  });
});
