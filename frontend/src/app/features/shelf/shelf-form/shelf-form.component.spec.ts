import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfFormComponent } from './shelf-form.component';

describe('ShelfFormComponent', () => {
  let component: ShelfFormComponent;
  let fixture: ComponentFixture<ShelfFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShelfFormComponent]
    })
      .compileComponents();
    
    fixture = TestBed.createComponent(ShelfFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
