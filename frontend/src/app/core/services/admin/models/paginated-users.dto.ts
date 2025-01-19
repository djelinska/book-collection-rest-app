import { Role } from '../../../../shared/enums/role';

export interface PaginatedUsersDto {
  readonly users: UserDto[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
}

export interface UserDto {
  readonly id: number;
  readonly username: string;
  readonly role: Role;
}
