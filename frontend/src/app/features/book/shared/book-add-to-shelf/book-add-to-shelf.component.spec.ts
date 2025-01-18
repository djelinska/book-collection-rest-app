import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAddToShelfComponent } from './book-add-to-shelf.component';

describe('BookAddToShelfComponent', () => {
  let component: BookAddToShelfComponent;
  let fixture: ComponentFixture<BookAddToShelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookAddToShelfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookAddToShelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
