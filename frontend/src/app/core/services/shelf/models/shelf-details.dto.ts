import { ShelfType } from '../../../../shared/enums/shelf-type';

export interface ShelfDetailsDto {
  readonly id: number;
  readonly name: string;
  readonly type: ShelfType;
  readonly numberOfBooks: number;
}

export interface BookDto {
  readonly id: number;
  readonly title: string;
  readonly author: string;
}
