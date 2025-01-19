export interface ReviewDto {
  readonly id: number;
  readonly rating: number;
  readonly content: string;
  readonly book: BookDto;
  readonly author: UserDto;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface BookDto {
  readonly id: number;
  readonly title: string;
}

export interface UserDto {
  readonly id: number;
  readonly username: string;
}
