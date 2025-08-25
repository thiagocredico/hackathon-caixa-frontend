import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-drawer-content',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './app-drawer-content.component.html',
})
export class AppDrawerContentComponent {
  @Input() pages: Array<{ title: string; url: string; icon: string }> = [];
  @Output() close = new EventEmitter<void>();

  constructor(private router: Router) {}

  onLogoClick() {
    this.router.navigate(['']);
    this.close.emit();
  }

  onLinkClick() {
    this.close.emit();
  }
}
