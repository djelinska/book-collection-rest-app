import { Component } from '@angular/core';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
