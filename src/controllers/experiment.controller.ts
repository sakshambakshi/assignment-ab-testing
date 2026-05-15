import { Request, Response, NextFunction } from 'express';
import { ExperimentService } from '@/services/experiment.service';

export class ExperimentController {
    private experimentService: ExperimentService;

    constructor() {
        this.experimentService = new ExperimentService();
    }

    public getExperiment = (req: Request, res: Response, next: NextFunction): any => {
        const userIdParam = req.query.user_id as string;

        if (!userIdParam) {
            return res.status(400).json({ error: 'user_id query parameter is required' });
        }

        const userId = Number(userIdParam.trim());

        if (isNaN(userId)) {
            return res.status(400).json({ error: 'user_id must be a valid number' });
        }

        try {
            const variant = this.experimentService.assignVariant(userId , "COLOR_EXPERIMENT");
            return res.json({
                user_id: userId,
                variant: variant.name,
                config: variant.config
            });
        } catch (error: any) {
            next(error);
        }
    }
}
