import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  public user$!: Observable<User>;
  public isAuthenticated: boolean = false;

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
      }
    });
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
