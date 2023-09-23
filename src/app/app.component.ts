import { Component } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HomeComponent,
    HttpClientModule
  ],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'homes';
}
