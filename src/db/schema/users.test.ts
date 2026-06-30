import { getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { users } from "@/db/schema/users";

describe("users schema", () => {
  it("maps to the users table", () => {
    expect(getTableName(users)).toBe("users");
  });

  it("defines id, email, name and created_at columns", () => {
    const columnNames = Object.keys(users);
    expect(columnNames).toContain("id");
    expect(columnNames).toContain("email");
    expect(columnNames).toContain("name");
    expect(columnNames).toContain("createdAt");
  });
});
