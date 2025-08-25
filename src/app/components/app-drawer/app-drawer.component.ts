import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-drawer',
  templateUrl: './app-drawer.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
  ],
})
export class AppDrawerComponent {
  @Input() pages: Array<{ title: string; url: string; icon: string }> = [];
  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;

  constructor(public router: Router) {}

  toggle() {
    this.sidenav.toggle();
  }

  open() {
    this.sidenav.open();
  }

  close() {
    this.sidenav.close();
  }

  onLogoClick() {
    this.router.navigate(['']);
    if (this.sidenav) this.sidenav.close();
  }
}
