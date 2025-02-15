import { Genre } from '../../../../shared/enums/genre';
import { Language } from '../../../../shared/enums/language';
import { ShelfDto } from '../../../../shared/models/shelf.dto';

export interface BookListDto {
  readonly id: number;
  readonly title: string;
  readonly author: string;
  readonly genre: Genre;
  readonly language: Language;
  readonly averageRating: number;
  readonly numberOfRatings: number;
  readonly description: string;
  readonly imagePath: string;
  readonly shelves: ShelfDto[];
}
