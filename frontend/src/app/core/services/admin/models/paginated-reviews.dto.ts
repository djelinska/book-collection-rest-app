import { ReviewDto } from './review.dto';

export interface PaginatedReviewsDto {
  readonly reviews: ReviewDto[];
  readonly totalPages: number;
  readonly totalElements: number;
  readonly currentPage: number;
}
