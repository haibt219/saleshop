import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BaseTranslatedComponent } from '../../base/base-translated.component';
import { Subject, takeUntil } from 'rxjs';
import { ComponentTranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    ComponentTranslatePipe,
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent
  extends BaseTranslatedComponent
  implements OnInit, OnDestroy
{
  @ViewChild('usernameInput') usernameInput!: ElementRef<HTMLInputElement>;
  protected componentName = 'login';

  loginForm: FormGroup;
  loginError: string = '';
  isLoading: boolean = false;

  private destroy$ = new Subject<void>();

  // Mock user data for demonstration
  private mockUsers = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'cashier1', password: 'cash123', role: 'cashier' },
    { username: 'employee1', password: 'emp123', role: 'employee' },
    { username: 'bartender1', password: 'bar123', role: 'bartender' },
  ];

  constructor(private fb: FormBuilder) {
    super();

    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      role: ['employee'],
    });
  }

  override async ngOnInit() {
    await super.ngOnInit();
    this.setupFormSubscriptions();
    setTimeout(() => {
      this.usernameInput?.nativeElement?.focus();
    });
  }

  override ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupFormSubscriptions(): void {
    // Clear error when user types
    this.loginForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.loginError) {
        this.loginError = '';
      }
    });
  }

  protected override onLanguageChange(lang: string): void {
    this.currentLanguage = lang;
    this.updateValidationMessages();
  }

  private updateValidationMessages() {
    // Trigger validation update when language changes
    const usernameControl = this.loginForm.get('username');
    const passwordControl = this.loginForm.get('password');

    usernameControl?.updateValueAndValidity();
    passwordControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = '';

      const loginData = this.loginForm.value;

      // Simulate API call delay
      setTimeout(() => {
        this.authenticateUser(loginData);
      }, 1000);
    }
  }

  private authenticateUser(loginData: any) {
    const user = this.mockUsers.find(
      (u) =>
        u.username === loginData.username &&
        u.password === loginData.password &&
        u.role === loginData.role
    );

    this.isLoading = false;

    if (user) {
      console.log('Login successful:', loginData);
      this.loginError = '';

      const successMessage = this.translate('success').replace(
        '{username}',
        loginData.username
      );
      alert(successMessage);
    } else {
      this.handleLoginError(loginData);
    }
  }

  private handleLoginError(loginData: any) {
    const userExists = this.mockUsers.find(
      (u) => u.username === loginData.username
    );

    if (!userExists) {
      this.loginError = this.translate('errors.usernameNotFound');
    } else {
      const passwordMatch = this.mockUsers.find(
        (u) =>
          u.username === loginData.username && u.password === loginData.password
      );

      if (!passwordMatch) {
        this.loginError = this.translate('errors.incorrectPassword');
      } else {
        this.loginError = this.translate('errors.roleMismatch');
      }
    }

    setTimeout(() => {
      const usernameInput = document.querySelector(
        'input[formControlName="username"]'
      ) as HTMLInputElement;
      usernameInput?.focus();
    }, 100);
  }

  onInputChange() {
    if (this.loginError) {
      this.loginError = '';
    }
  }

  clearForm() {
    this.loginForm.reset();
    this.loginForm.patchValue({ role: 'employee' });
    this.loginError = '';
  }

  // Helper methods for template
  getRoleText(role: string): string {
    return this.translate(`roles.${role}`);
  }

  getFieldErrorMessage(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control?.hasError('required')) {
      return this.translate(`validation.${fieldName}.required`);
    }
    return '';
  }

  // Debug method
  getSystemInfo(): string {
    const systemLang = navigator.language.toLowerCase();
    return `System: ${systemLang} | Current: ${this.currentLanguage}`;
  }
}
