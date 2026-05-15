import { Router } from "express";
import { ExperimentController } from "@/controllers/experiment.controller";

const router = Router();
const experimentController = new ExperimentController();

// multiple experiment routes can be added here in the future
router.get("/", experimentController.getExperiment);

export default router;
