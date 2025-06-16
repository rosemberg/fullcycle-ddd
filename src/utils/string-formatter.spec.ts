import { capitalizeWords, truncate } from "./string-formatter";

describe("String formatter utility tests", () => {
  describe("capitalizeWords", () => {
    it("should capitalize the first letter of each word", () => {
      expect(capitalizeWords("hello world")).toBe("Hello World");
      expect(capitalizeWords("HELLO WORLD")).toBe("Hello World");
      expect(capitalizeWords("hello WORLD")).toBe("Hello World");
    });

    it("should handle empty strings", () => {
      expect(capitalizeWords("")).toBe("");
    });

    it("should handle null and undefined", () => {
      expect(capitalizeWords(null as any)).toBe(null);
      expect(capitalizeWords(undefined as any)).toBe(undefined);
    });

    it("should handle single words", () => {
      expect(capitalizeWords("hello")).toBe("Hello");
      expect(capitalizeWords("HELLO")).toBe("Hello");
    });
  });

  describe("truncate", () => {
    it("should truncate strings longer than maxLength", () => {
      expect(truncate("Hello World", 5)).toBe("Hello...");
      expect(truncate("Hello World", 7)).toBe("Hello W...");
    });

    it("should not truncate strings shorter than or equal to maxLength", () => {
      expect(truncate("Hello", 5)).toBe("Hello");
      expect(truncate("Hello", 10)).toBe("Hello");
    });

    it("should handle empty strings", () => {
      expect(truncate("", 5)).toBe("");
    });

    it("should handle null and undefined", () => {
      expect(truncate(null as any, 5)).toBe(null);
      expect(truncate(undefined as any, 5)).toBe(undefined);
    });
  });
});