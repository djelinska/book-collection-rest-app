import { UserDto } from '../../../../shared/models/user.dto';

export interface LoginResponse {
  readonly token: string;
  readonly user: UserDto;
}
