import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBookComponent } from './admin-book.component';

describe('AdminBookComponent', () => {
  let component: AdminBookComponent;
  let fixture: ComponentFixture<AdminBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBookComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
