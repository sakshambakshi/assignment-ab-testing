import request from "supertest";
import app from "@/app";
import { ExperimentService } from "@/services/experiment.service";

describe("Experiment API", () => {
  it("should return 400 if user_id is missing", async () => {
    const response = await request(app).get("/experiment");
    expect(response.status).toBe(400);
    expect(response.body.error).toContain(
      "user_id query parameter is required",
    );
  });

  it("should return 400 if user_id is invalid", async () => {
    const response = await request(app).get("/experiment?user_id=invalid");
    expect(response.status).toBe(400);
    expect(response.body.error).toContain("user_id must be a valid number");
  });

  it("should return a valid assignment for user_id=42", async () => {
    const response = await request(app).get("/experiment?user_id=42");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user_id", 42);
    expect(response.body).toHaveProperty("variant");
    expect(response.body).toHaveProperty("config");
  });

  it("should return consistent variant for the same user_id", async () => {
    const response1 = await request(app).get("/experiment?user_id=99");
    const response2 = await request(app).get("/experiment?user_id=99");

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
    expect(response1.body.variant).toBe(response2.body.variant);
  });

  it("should distribute variants according to weights (Statistical check)", () => {
    const service = new ExperimentService();
    const counts: Record<string, number> = {};

    for (let i = 0; i < 1000; i++) {
      const variant = service.assignVariant(i, "COLOR_EXPERIMENT");
      counts[variant.name] = (counts[variant.name] || 0) + 1;
    }

    // Assuming Group_A is 50%
    expect(counts["Group_A"]).toBeGreaterThan(400);
    expect(counts["Group_A"]).toBeLessThan(600);
  });
});
