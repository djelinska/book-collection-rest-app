import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBookFormComponent } from './admin-book-form.component';

describe('AdminBookFormComponent', () => {
  let component: AdminBookFormComponent;
  let fixture: ComponentFixture<AdminBookFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBookFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminBookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
