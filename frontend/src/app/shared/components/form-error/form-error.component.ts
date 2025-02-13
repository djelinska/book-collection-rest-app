import { Component, Input } from '@angular/core';

import { AbstractControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './form-error.component.html',
  styleUrl: './form-error.component.scss',
})
export class FormErrorComponent {
  @Input() public control!: AbstractControl | null;
}
