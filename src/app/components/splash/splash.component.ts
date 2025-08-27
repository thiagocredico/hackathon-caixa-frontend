import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

@Component({
    selector: 'app-splash',
    templateUrl: './splash.component.html',
    
    imports: [MatProgressSpinnerModule]
})
export class SplashComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/simulacao']);
    }, 4500); // 4.5 segundos
  }
}
