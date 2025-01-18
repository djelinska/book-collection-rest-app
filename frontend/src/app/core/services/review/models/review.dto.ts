export interface ReviewDto {
  readonly id: number;
  readonly rating: number;
  readonly content: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly author: string;
}
