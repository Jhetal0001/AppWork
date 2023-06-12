/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => {
    const appHtml = document.getElementById('appHtml');
    if (appHtml) {
      appHtml.setAttribute('data-bs-theme', 'dark');
    }
  })
  .catch(err => console.error(err));
