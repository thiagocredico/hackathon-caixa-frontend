import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { AppDrawerContentComponent } from '../app-drawer-content/app-drawer-content.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, AppDrawerContentComponent, RouterOutlet],
  templateUrl: './app-header.component.html',
  
})
export class AppHeaderComponent {
  @Input() appPages: any[] = [];
  @Output() openDrawer = new EventEmitter<void>();
}
