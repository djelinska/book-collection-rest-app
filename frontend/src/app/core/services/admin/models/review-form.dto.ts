export interface ReviewFormDto {
  readonly rating: number | null;
  readonly content: string;
  readonly bookId: number | null;
  readonly userId: number | null;
}
