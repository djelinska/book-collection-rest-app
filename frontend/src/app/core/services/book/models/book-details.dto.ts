import { EbookFormat } from '../../../../shared/enums/ebook-format';
import { Genre } from '../../../../shared/enums/genre';
import { Language } from '../../../../shared/enums/language';
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
  readonly language: Language;
  readonly averageRating: number;
  readonly numberOfRatings: number;
  readonly description: string;
  readonly imagePath: string;
  readonly isEbook: boolean;
  readonly ebookFormat: EbookFormat | null;
  readonly ebookFileSize: number | null;
  readonly ebookLink: string;
  readonly shelves: ShelfDto[];
}
