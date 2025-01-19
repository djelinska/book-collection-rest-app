import { Role } from '../enums/role';

export interface UserDto {
  readonly id: number;
  readonly username: string;
  readonly role: Role;
}
