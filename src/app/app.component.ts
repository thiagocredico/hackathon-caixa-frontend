import { Component, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppDrawerContentComponent } from './components/app-drawer-content/app-drawer-content.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    imports: [
        
        CommonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatIconModule,
  MatButtonModule,
  AppDrawerContentComponent,
  AppHeaderComponent,
        RouterOutlet,
    ]
})
export class AppComponent {
  interfacePage = '';

  @ViewChild('drawer') drawer!: MatSidenav;

  public appPages: Array<{ title: string; url: string; icon: string }> = [
    { title: 'Produtos', url: '/produtos', icon: 'store' },
    { title: 'Novo Produto', url: '/novo-produto', icon: 'add_circle' },
    { title: 'Simulação', url: '/simulacao', icon: 'calculate' },
    { title: 'Resultado', url: '/resultado', icon: 'description' },
  ];

  public activeUrl = '';

  constructor(public router: Router) {
    // keep activeUrl in sync with router so the UI can reflect active state
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.activeUrl = ev.urlAfterRedirects || ev.url;
      }
    });
  }

  isActive(page: { title: string; url: string; icon: string }) {
    return this.activeUrl === page.url;
  }

  toggle() {
    if (this.drawer) this.drawer.toggle();
  }

  close() {
    if (this.drawer) this.drawer.close();
  }

  onLogoClick(drawer?: { close: () => void }) {
    this.router.navigate(['']);
    if (drawer && typeof drawer.close === 'function') {
      drawer.close();
    } else {
      this.close();
    }
  }
}
