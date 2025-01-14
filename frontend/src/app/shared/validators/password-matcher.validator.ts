import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatcherValidator(
  passwordControlName: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.parent?.get(passwordControlName);
    const confirmPassword = control;

    if (password && password.value !== confirmPassword.value) {
      return { mismatch: true };
    }

    return null;
  };
}
