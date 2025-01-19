import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-book',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './admin-book.component.html',
  styleUrl: './admin-book.component.scss',
})
export class AdminBookComponent {}
