import { EbookFormat } from '../../../../shared/enums/ebook-format';
import { Genre } from '../../../../shared/enums/genre';
import { Language } from '../../../../shared/enums/language';

export interface BookDto {
  readonly id: number;
  readonly title: string;
  readonly author: string;
  readonly publisher: string;
  readonly isbn: string;
  readonly publicationYear: number;
  readonly genre: Genre;
  readonly pageCount: number;
  readonly language: Language;
  readonly description: string;
  readonly imagePath: string;
  readonly isEbook: boolean;
  readonly ebookFormat: EbookFormat | null;
  readonly ebookFileSize: number | null;
  readonly ebookLink: string;
}
