import { describe, expect, it } from "vitest";
import { looksLikeOemCode } from "@/lib/oem-detect";

describe("looksLikeOemCode", () => {
  it("detects Hyundai-style OEM numbers", () => {
    expect(looksLikeOemCode("12345-67890")).toBe(true);
    expect(looksLikeOemCode("0K12345678")).toBe(true);
  });

  it("rejects empty or plain text", () => {
    expect(looksLikeOemCode("")).toBe(false);
    expect(looksLikeOemCode("bomba de agua")).toBe(false);
  });
});
