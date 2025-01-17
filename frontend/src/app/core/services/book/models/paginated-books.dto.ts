import { BookDto } from '../../../../shared/models/book.dto';

export interface PaginatedBooksDto {
  books: BookDto[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
}
