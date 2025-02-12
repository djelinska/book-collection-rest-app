import { AbstractControl, ValidationErrors } from '@angular/forms';

export function urlValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value as string;
  if (!value) {
    return null;
  }

  const pattern = /^(http|https):\/\/[^\s$.?#].[^\s]*$/i;
  const valid = pattern.test(value);

  return valid ? null : { pattern: true };
}
