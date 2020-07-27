import { getRepository } from 'typeorm';
import User from '../models/User';
import { hash } from 'bcryptjs';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);
    const checkIfUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkIfUserExists) {
      throw new Error('Email address already used.');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);
    delete user.password;
    return user;
  }
}

export default CreateUserService;
