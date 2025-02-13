import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { Observable } from 'rxjs';
import { Role } from '../../enums/role';
import { TranslateModule } from '@ngx-translate/core';
import { UserDto } from '../../models/user.dto';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    LanguageSelectorComponent,
    TranslateModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  public user$!: Observable<UserDto>;
  public isAuthenticated: boolean = false;
  public adminRole: Role = Role.ROLE_ADMIN;
  public loggedInUser!: UserDto | null;

  public constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((authenticated) => {
      this.isAuthenticated = authenticated;

      if (authenticated) {
        this.user$ = this.userService.getUserProfile();
        this.loggedInUser = this.authService.getLoggedInUser();
      }
    });
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
