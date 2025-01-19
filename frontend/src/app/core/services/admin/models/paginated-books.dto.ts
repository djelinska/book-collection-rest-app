import { BookDto } from './book.dto';

export interface PaginatedBooksDto {
  readonly books: BookDto[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
}
