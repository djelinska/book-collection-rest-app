import { Genre } from '../../../../shared/enums/genre';
import { ShelfDto } from '../../../../shared/models/shelf.dto';

export interface BookDetailsDto {
  readonly id: number;
  readonly title: string;
  readonly author: string;
  readonly publisher: string;
  readonly isbn: string;
  readonly publicationYear: number;
  readonly genre: Genre;
  readonly pageCount: number;
  readonly language: Genre;
  readonly averageRating: number;
  readonly numberOfRatings: number;
  readonly description: string;
  readonly imagePath: string;
  readonly shelves: ShelfDto[];
}
