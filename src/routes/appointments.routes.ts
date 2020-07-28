import { Router, Request } from 'express';
import { getCustomRepository } from 'typeorm';
import CreateAppointmentService from '../services/CreateAppointmentsService';
import AppoitmentsRepository from '../repositories/AppointmentsRepository';
import { parseISO } from 'date-fns';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const appointmentRouter = Router();

appointmentRouter.use(ensureAuthenticated);

appointmentRouter.get('/', async (req: Request, res) => {
  console.log(req.user);

  const appointmentsRepository = getCustomRepository(AppoitmentsRepository);
  const appointments = await appointmentsRepository.find();

  return res.json(appointments);
});

appointmentRouter.post('/', async (req, res) => {
  try {
    const { provider_id, date } = req.body;

    const parseDate = parseISO(date);

    const createAppointment = new CreateAppointmentService();

    const appointment = await createAppointment.execute({
      date: parseDate,
      provider_id,
    });

    return res.json(appointment);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

export default appointmentRouter;
