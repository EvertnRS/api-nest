import { Role } from '@prisma/client';

export class CreateUserDto {
  name: string;
  email: string;
  cpf: string;
  role: Role;
  password: string;
}
