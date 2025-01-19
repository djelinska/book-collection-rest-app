import { Role } from '../../../../shared/enums/role';

export interface PaginatedUsersDto {
  readonly users: UserDto[];
  readonly totalPages: number;
  readonly totalElements: number;
  readonly currentPage: number;
}

export interface UserDto {
  readonly id: number;
  readonly username: string;
  readonly role: Role;
}
