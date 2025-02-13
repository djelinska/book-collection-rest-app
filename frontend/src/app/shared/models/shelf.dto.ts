import { ShelfType } from '../enums/shelf-type';

export interface ShelfDto {
  readonly id: number;
  readonly name: string;
  readonly type: ShelfType;
}
