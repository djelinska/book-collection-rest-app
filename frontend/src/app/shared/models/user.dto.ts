import { Role } from '../enums/role';

export interface UserDto {
  readonly username: string;
  readonly role: Role;
}
