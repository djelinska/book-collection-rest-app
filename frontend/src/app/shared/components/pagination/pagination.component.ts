import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Input() public page = 0;
  @Input() public totalPages = 0;
  @Input() public pageSizeOptions: number[] = [2, 5, 10];
  @Input() public pageSize = 5;

  @Output() public pageChange = new EventEmitter<number>();
  @Output() public pageSizeChange = new EventEmitter<number>();

  public get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  public goToPage(page: number): void {
    this.pageChange.emit(page);
  }

  public onPageSizeChange(size: number): void {
    this.pageSizeChange.emit(size);
  }
}
