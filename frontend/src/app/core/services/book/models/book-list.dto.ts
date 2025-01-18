export interface BookListDto {
  readonly id: number;
  readonly title: string;
  readonly author: string;
  readonly publisher: string;
  readonly isbn: string;
  readonly publicationYear: number;
  readonly genre: string;
  readonly pageCount: number;
  readonly language: string;
  readonly averageRating: number;
  readonly numberOfRatings: number;
  readonly description: string;
  readonly imagePath: string;
}
