import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { ChartModule } from 'primeng/chart';
import { KnobModule } from 'primeng/knob';

import { faker } from '@faker-js/faker';
import { ApiService } from '../../services/ApiService';

interface IFeedback {
  type: string;
  message: string;
  status: string;
  date: Date;
  messageId?: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ImageModule,
    ChartModule,
    KnobModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  pieData: any;
  pieOptions: any;
  stackedData: any;
  stackedOptions: any;

  documentStyle: any;
  textColor: any;
  textColorSecondary: any;
  surfaceBorder: any;
  backgroundColor: any;

  messages!: any[];

  knobValue: number = 70;
  
  constructor(private apiService: ApiService) { }
  

  ngOnInit() {
    this.documentStyle = getComputedStyle(document.documentElement);
    this.textColor = this.documentStyle.getPropertyValue('--text-color');
    this.textColorSecondary = this.documentStyle.getPropertyValue('--text-color-secondary');
    this.surfaceBorder = this.documentStyle.getPropertyValue('--surface-border');

    this.backgroundColor = [this.documentStyle.getPropertyValue('--green-300'), this.documentStyle.getPropertyValue('--yellow-300'), this.documentStyle.getPropertyValue('--red-300')];

    this.mountPieChart();
    this.mountStackedBarChart();
  }

  async elogioClicked() {
    console.log('Elogio button clicked');

    let data: IFeedback = { 
      type: 'elogio',
      message: faker.lorem.sentence(),
      status: 'Recebido',
      date: new Date(),
    };

    this.apiService.send(data).subscribe({
      next: (response) => {
        data.messageId = response.messageId;
        this.setMessages(data);
        console.log('Recebido:', data);
      },
      error: (error) => {
        console.error('Erro ao chamar a API:', error);
      }
    });
  }

  sugestaoClicked() {
    console.log('Sugestão button clicked');

    let data: IFeedback = { 
      type: 'sugestao',
      message: faker.lorem.sentence(),
      status: 'Recebido',
      date: new Date(),
    };

    this.apiService.send(data).subscribe({
      next: (response) => {
        data.messageId = response.messageId;
        this.setMessages(data);
        console.log('Recebido:', data);
      },
      error: (error) => {
        console.error('Erro ao chamar a API:', error);
      }
    });
  }

  criticaClicked() {
    console.log('Crítica button clicked');

    let data: IFeedback = { 
      type: 'critica',
      message: faker.lorem.sentence(),
      status: 'Recebido',
      date: new Date(),
    };

    this.apiService.send(data).subscribe({
      next: (response) => {
        data.messageId = response.messageId;
        this.setMessages(data);
        console.log('Recebido:', data);
      },
      error: (error) => {
        console.error('Erro ao chamar a API:', error);
      }
    });
  }
  
  mountPieChart() {
    this.pieData = {
      labels: ['Elogios', 'Sugestões', 'Críticas'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: this.backgroundColor,
          hoverBackgroundColor: [this.documentStyle.getPropertyValue('--green-100'), this.documentStyle.getPropertyValue('--yellow-100'), this.documentStyle.getPropertyValue('--red-100')]
        }
      ]
    };

    this.pieOptions = {
      showTooltips: true,
      cutout: '50%',
      plugins: {
        legend: {
          labels: {
            color: this.textColor
          }
        }
      }
    };    
  } 

  mountStackedBarChart() {

    this.stackedData = {
      labels: ['Recebido', 'Em Processamento', 'Finalizado'],
      datasets: [
        {
          type: 'bar',
          label: 'Elogios',
          backgroundColor: this.backgroundColor[0],
          data: [50, 25, 12]
        },
        {
          type: 'bar',
          label: 'Sugestões',
          backgroundColor: this.backgroundColor[1],
          data: [21, 84, 24]
        },
        {
          type: 'bar',
          label: 'Críticas',
          backgroundColor: this.backgroundColor[2],
          data: [41, 52, 24]
        }
      ]
    };

    this.stackedOptions = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltips: {
          mode: 'index',
          intersect: false
        },
        legend: {
          labels: {
            color: this.textColor
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: this.textColorSecondary
          },
          grid: {
            color: this.surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          stacked: true,
          ticks: {
            color: this.textColorSecondary
          },
          grid: {
            color: this.surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  getMessages() {
    return localStorage.getItem('messages') ? JSON.parse(localStorage.getItem('messages') || '{}') : []
  }

  setMessages(value: any) {
    this.messages = this.getMessages();
    this.messages.push(value);
    return localStorage.setItem('messages', JSON.stringify(this.messages));
  }
}