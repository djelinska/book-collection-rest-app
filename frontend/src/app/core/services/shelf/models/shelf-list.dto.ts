import { ShelfType } from '../../../../shared/enums/shelf-type';

export interface ShelfListDto {
  readonly id: number;
  readonly name: string;
  readonly type: ShelfType;
  readonly numberOfBooks: number;
}
