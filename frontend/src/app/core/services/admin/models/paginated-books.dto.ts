import { BookDto } from './book.dto';

export interface PaginatedBooksDto {
  readonly books: BookDto[];
  readonly totalPages: number;
  readonly totalElements: number;
  readonly currentPage: number;
}
