import { Role } from '../../../../shared/enums/role';

export interface UserFormDto {
  readonly username: string;
  readonly role: Role;
  readonly password?: string;
}
