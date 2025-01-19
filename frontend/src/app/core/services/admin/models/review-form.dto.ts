export interface ReviewFormDto {
  readonly rating: number;
  readonly content: string;
  readonly bookId: number;
  readonly userId: number;
}
