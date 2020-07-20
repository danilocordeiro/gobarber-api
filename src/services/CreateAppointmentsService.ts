import AppointmentRespository from '../repositories/AppointmentsRepository';
import Appointment from '../models/Appointments';
import { getCustomRepository } from 'typeorm';
import { startOfHour } from 'date-fns';

interface Request {
  provider: string;
  date: Date;
}

export default class CreateAppointmentService {
  public async execute({ date, provider }: Request): Promise<Appointment> {
    const appointmentRespository = getCustomRepository(AppointmentRespository);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentRespository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw Error('This appointment is already booked');
    }

    const appointment = appointmentRespository.create({
      provider,
      date: appointmentDate,
    });

    await appointmentRespository.save(appointment);

    return appointment;
  }
}
