import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { StatsService } from '../../core/services/stats/stats.service';
import { UserDto } from '../../shared/models/user.dto';
import { UserStatsDto } from '../../core/services/stats/models/user-stats.dto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  public loggedInUser!: UserDto | null;
  public userStats$!: Observable<UserStatsDto>;

  public homeAppUser: UserDto | null = null;

  public constructor(
    private authService: AuthService,
    private statsService: StatsService
  ) {}

  public ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedInUser();

    this.userStats$ = this.statsService.getUserStatistics();
  }
}
