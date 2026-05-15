import express from 'express';
import { requestLogger } from '@/middlewares/requestLogger';
import experimentRoutes from '@/routes/experiment.routes';

const app = express();

app.use(express.json());
app.use(requestLogger);

app.use('/experiment', experimentRoutes);

export default app;
