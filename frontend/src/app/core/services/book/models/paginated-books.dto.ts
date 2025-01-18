import { BookListDto } from './book-list.dto';

export interface PaginatedBooksDto {
  books: BookListDto[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
}
