import { Component, OnChanges, OnInit, SimpleChanges  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { ChartModule } from 'primeng/chart';
import { KnobModule } from 'primeng/knob';
import { ProgressBarModule } from 'primeng/progressbar';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

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
    ProgressBarModule,
    ReactiveFormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loading: boolean = false;

  formGroupElogio!: FormGroup;
  formGroupSugestao!: FormGroup;
  formGroupCritica!: FormGroup;

  pieData: any;
  pieOptions: any;
  stackedData: any;
  stackedOptions: any;

  documentStyle: any;
  textColor: any;
  textColorSecondary: any;
  surfaceBorder: any;
  backgroundColor: any;

  messagesStorage: any[] = [];
  messages: any[] = [];
  typeCounter: { [key: string]: number } = {};

  size: number = 0;
  
  constructor(private apiService: ApiService) { }
  
  ngOnInit() {

    this.documentStyle = getComputedStyle(document.documentElement);
    this.textColor = this.documentStyle.getPropertyValue('--text-color');
    this.textColorSecondary = this.documentStyle.getPropertyValue('--text-color-secondary');
    this.surfaceBorder = this.documentStyle.getPropertyValue('--surface-border');
    this.backgroundColor = [this.documentStyle.getPropertyValue('--green-300'), this.documentStyle.getPropertyValue('--yellow-300'), this.documentStyle.getPropertyValue('--red-300')];

    this.mountKnob();
    this.info();
  }

  async elogioClicked() {
    this.loading = true;
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
        this.setStorageMessage(data);
        console.log('Recebido:', data);
        this.info();
      },
      error: (error) => {
        console.error('Erro ao chamar a API:', error);
      }
    });
  }

  sugestaoClicked() {
    this.loading = true;
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
        this.setStorageMessage(data);
        console.log('Recebido:', data);
        this.info();
      },
      error: (error) => {
        console.error('Erro ao chamar a API:', error);
      }
    });
  }

  criticaClicked() {
    this.loading = true;
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
        this.setStorageMessage(data);
        console.log('Recebido:', data);
        this.info();
      },
      error: (error) => {
        console.error('Erro ao chamar a API:', error);
      }
    });
  }
  
  info() {
    this.loading = true;
    this.apiService.size().subscribe({
      next: (response) => {
        console.log('Tamanho da fila:', response.size);
        this.size = response.size;
        const infoPromises: Promise<any>[] = [];
        for (let i = 0; i < this.size; i++) {
          const infoPromise = new Promise<void>((resolve, reject) => {
            this.apiService.info().subscribe({
              next: (response) => {
                (response.messages.Messages ?? []).forEach((message: any) => {
                  this.messages[message.MessageId] = JSON.parse(message.Body || '{}');
                });
                resolve();
              },
              error: (error) => {
                console.error('Erro ao chamar a API:', error);
                reject(error);
              }
            });
          });

          infoPromises.push(infoPromise);
        }

        Promise.all(infoPromises)
          .then(() => {
            this.typeCounter = {};
            for (const key in this.messages) {
              if (this.messages.hasOwnProperty(key)) {
                const message = this.messages[key];
                if (!this.typeCounter[message.type]) {
                  this.typeCounter[message.type] = 0;
                }
                this.typeCounter[message.type]++;
              }
            }
            this.mountPieChart();
            this.mountStackedBarChart();
            this.mountKnob();
            this.loading = false;
          })
          .catch((error) => {
            console.error('Erro ao realizar chamadas a this.apiService.info():', error);
          });

      },
      error: (error) => {
        console.error('Erro ao chamar a API:', error);
      }
    });
  }

  mountPieChart() {

    let elogios = this.typeCounter['elogio'];
    let sugestoes = this.typeCounter['sugestao'];
    let criticas = this.typeCounter['critica'];

    this.pieData = {
      labels: ['Elogios', 'Sugestões', 'Críticas'],
      datasets: [
        {
          data: [elogios, sugestoes, criticas],
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

  mountKnob() {
    this.formGroupElogio = new FormGroup({
      value: new FormControl(this.typeCounter['elogio'])
    });
    this.formGroupSugestao = new FormGroup({
      value: new FormControl(this.typeCounter['sugestao'])
    });
    this.formGroupCritica = new FormGroup({
      value: new FormControl(this.typeCounter['critica'])
    });
  }

  getStorageMessages() {
    return localStorage.getItem('messages') ? JSON.parse(localStorage.getItem('messages') || '{}') : []
  }

  setStorageMessage(value: any) {
    this.messagesStorage = this.getStorageMessages();
    this.messagesStorage.push(value);
    return localStorage.setItem('messages', JSON.stringify(this.messagesStorage));
  }
}