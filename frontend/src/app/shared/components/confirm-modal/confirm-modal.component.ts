import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
})
export class ConfirmModalComponent {
  public title: string = 'Potwierdź';
  public message: string = 'Czy na pewno chcesz wykonać tę operację?';

  public constructor(public modalRef: BsModalRef) {}

  public confirmCallback?: () => void;
  public cancelCallback?: () => void;

  public onConfirm(): void {
    if (this.confirmCallback) {
      this.confirmCallback();
    }
    this.modalRef.hide();
  }

  public onCancel(): void {
    if (this.cancelCallback) {
      this.cancelCallback();
    }
    this.modalRef.hide();
  }
}
