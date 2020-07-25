import AppointmentRespository from '../repositories/AppointmentsRepository';
import Appointment from '../models/Appointments';
import { getCustomRepository } from 'typeorm';
import { startOfHour } from 'date-fns';

interface Request {
  provider_id: string;
  date: Date;
}

export default class CreateAppointmentService {
  public async execute({ date, provider_id }: Request): Promise<Appointment> {
    const appointmentRespository = getCustomRepository(AppointmentRespository);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentRespository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw Error('This appointment is already booked');
    }

    const appointment = appointmentRespository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentRespository.save(appointment);

    return appointment;
  }
}
