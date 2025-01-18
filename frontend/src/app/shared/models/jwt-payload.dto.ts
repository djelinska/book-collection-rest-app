export interface JwtPayloadDto {
  readonly sub: string;
  readonly iat: number;
  readonly exp: number;
}
