import { Router } from 'express';
import appointmentsRouter from './appointments.routes';
import appointmentRouter from './appointments.routes';

const routes = Router();

routes.use('/appointments', appointmentRouter);

export default routes;
