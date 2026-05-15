import { Request, Response } from "express";
import { ExperimentService } from "@/services/experiment.service";

export class ExperimentController {
  private experimentService: ExperimentService;

  constructor() {
    this.experimentService = new ExperimentService();
  }

  public getExperiment = (req: Request, res: Response): any => {
    const userIdParam = req.query.user_id as string;

    if (!userIdParam) {
      return res
        .status(400)
        .json({ error: "user_id query parameter is required" });
    }

    const userId = Number(userIdParam.trim());

    if (isNaN(userId)) {
      return res.status(400).json({ error: "user_id must be a valid number" });
    }

    try {
      const variant = this.experimentService.assignVariant(
        userId,
        "COLOR_EXPERIMENT",
      );
      return res.json({
        user_id: userId,
        variant,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  };
}
