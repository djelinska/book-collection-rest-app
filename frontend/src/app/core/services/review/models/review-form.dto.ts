import { QuoteDto } from '../../../../shared/models/quote.dto';

export interface ReviewFormDto {
  readonly rating: number | null;
  readonly content: string;
  readonly quotes: QuoteDto[];
}
