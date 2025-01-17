import { ResolveFn } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { bookResolver } from './book.resolver';

describe('bookResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => bookResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
