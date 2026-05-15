import express from 'express';
import { requestLogger } from '@/middlewares/requestLogger';
import { errorHandler } from '@/middlewares/errorHandler';
import experimentRoutes from '@/routes/experiment.routes';

const app = express();

app.use(express.json());
app.use(requestLogger);

app.use('/experiment', experimentRoutes);

app.use(errorHandler);

export default app;
