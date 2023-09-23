/*
*  Protractor support is deprecated in Angular.
*  Protractor is used in this example for compatibility with Angular documentation tools.
*/
import { bootstrapApplication,provideProtractorTestingSupport } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent,
    {providers: [provideProtractorTestingSupport(), MessageService]})
  .catch(err => console.error(err));
