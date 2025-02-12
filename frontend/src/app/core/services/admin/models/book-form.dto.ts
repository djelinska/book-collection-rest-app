import { EbookFormat } from '../../../../shared/enums/ebook-format';
import { Genre } from '../../../../shared/enums/genre';
import { Language } from '../../../../shared/enums/language';

export interface BookFormDto {
  readonly title: string;
  readonly author: string;
  readonly publisher: string;
  readonly isbn: string;
  readonly publicationYear: number | null;
  readonly genre: Genre | null;
  readonly pageCount: number | null;
  readonly language: Language | null;
  readonly description: string;
  readonly imagePath?: string;
  readonly isEbook: boolean;
  readonly ebookFormat: EbookFormat | null;
  readonly ebookFileSize: number | null;
  readonly ebookLink: string;
}
