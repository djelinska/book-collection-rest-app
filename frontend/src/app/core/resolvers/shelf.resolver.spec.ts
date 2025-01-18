import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { shelfResolver } from './shelf.resolver';

describe('shelfResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
    TestBed.runInInjectionContext(() => shelfResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
