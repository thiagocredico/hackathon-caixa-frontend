import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { provideAnimations } from '@angular/platform-browser/animations';


import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { loadMaterialTheme } from './app/theme-loader';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
  provideRouter(routes),

    provideAnimations(), // <-- Isso ativa as animações

  ],
});

// Load Material theme at runtime (non-blocking)
loadMaterialTheme().catch(() => {
  // ignore theme load failure; app still usable without theme
});
