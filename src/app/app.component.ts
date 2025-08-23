import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
  MatButtonModule,
  RouterOutlet,
  ],
})
export class AppComponent {
  public appPages = [
    { title: 'Produtos', url: '/produtos', icon: 'business' },
    { title: 'Novo Produto', url: '/novo-produto', icon: 'add-circle' },
    { title: 'Simulação', url: '/simulacao', icon: 'calculator' },
    { title: 'Resultado', url: '/resultado', icon: 'document-text' },
  ];
  constructor(public router: Router) {}

  onLogoClick(drawer: any) {
    this.router.navigate(['']);
    if (drawer) drawer.close();
  }
}
