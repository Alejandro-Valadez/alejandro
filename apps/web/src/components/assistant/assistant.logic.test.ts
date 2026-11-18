import { describe, expect, it } from "vite-plus/test";

import { memoryDraftState } from "./assistant.logic";

describe("memoryDraftState", () => {
  it("shows the saved file until edited", () => {
    expect(memoryDraftState("hi", null)).toEqual({ value: "hi", dirty: false });
  });

  it("marks a changed draft dirty", () => {
    expect(memoryDraftState("hi", "hello")).toEqual({ value: "hello", dirty: true });
  });

  it("treats a draft equal to the saved file as clean", () => {
    expect(memoryDraftState("hi", "hi").dirty).toBe(false);
  });

  it("stays empty and clean while loading", () => {
    expect(memoryDraftState(null, null)).toEqual({ value: "", dirty: false });
  });
});
