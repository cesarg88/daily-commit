import { describe, expect, it } from "vitest";
import { parseObjectiveFormData } from "./objective-form";

describe("parseObjectiveFormData", () => {
  it("parses binary objective form data", () => {
    const formData = new FormData();
    formData.set("name", "Read");
    formData.set("type", "binary");

    expect(parseObjectiveFormData(formData)).toEqual({
      name: "Read",
      type: "binary",
      defaultTargetValue: undefined,
      defaultUnit: "",
      defaultWeight: undefined,
    });
  });

  it("parses numeric objective form data", () => {
    const formData = new FormData();
    formData.set("name", "Walk");
    formData.set("type", "numeric");
    formData.set("defaultTargetValue", "8");
    formData.set("defaultUnit", "km");
    formData.set("defaultWeight", "30");

    expect(parseObjectiveFormData(formData)).toEqual({
      name: "Walk",
      type: "numeric",
      defaultTargetValue: 8,
      defaultUnit: "km",
      defaultWeight: 30,
    });
  });
});
