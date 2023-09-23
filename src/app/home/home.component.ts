import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { ApiService } from '../services/ApiService';
import { Observable } from 'rxjs';

interface IFeedback {
  type: string;
  message: string;
  status: string;
  date: Date;
  messageId?: number;
}

interface IQueueSize {
  totalSize: number;
  ApproximateNumberOfMessages: number;
  ApproximateNumberOfMessagesNotVisible: number;
  ApproximateNumberOfMessagesDelayed: number;
}

@Component({
  providers: [MessageService, ConfirmationService],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loading: boolean = false;

  textAreaValue: string = '';

  pieData: any;
  pieOptions: any;
  stackedData: any;
  stackedOptions: any;

  documentStyle: any;
  textColor: any;
  textColorSecondary: any;
  surfaceBorder: any;

  messagesStorage: any[] = [];
  messages: any[] = [];
  typeCounter: { [key: string]: number } = {};

  totalSize: number = 0;
  elogioQueue!: IQueueSize;
  sugestaoQueue!: IQueueSize;
  criticaQueue!: IQueueSize;
  animationDuration: any = 1000;
  position: string = 'bottom';

  constructor(private apiService: ApiService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.documentStyle = getComputedStyle(document.documentElement);
    this.textColor = this.documentStyle.getPropertyValue('--text-color');
    this.textColorSecondary = this.documentStyle.getPropertyValue('--text-color-secondary');
    this.surfaceBorder = this.documentStyle.getPropertyValue('--surface-border');

    this.size();
  }

  async send(type : string) {
    console.log(`${type} button clicked`);

    this.loading = true;

    if (this.textAreaValue) {
      let data: IFeedback = {
        type: type,
        message: this.textAreaValue,
        status: 'Recebido',
        date: new Date(),
      };
      this.apiService.send(data).subscribe({
        next: (response) => {
          console.log('Recebido:', data);

          data.messageId = response.messageId;
          this.textAreaValue = '';

          this.setStorageMessage(data);
          this.size();
          this.messageService.add({ severity: 'success', summary: 'Feedback enviado com sucesso!', detail: `${type}: ${response.messageId}.` });
        },
        error: (error) => {
          console.error('Erro ao chamar a API:', error);
        }
      });
    } else {
      this.textAreaValue = '';
      this.loading = false;
    }
  }


  size(): Observable<any> {
    this.loading = true;
    const sizeObservable: Observable<any> = this.apiService.size();
    sizeObservable.subscribe({
      next: (response: any) => {
        console.log('size():', response);

        this.totalSize = response.totalSize;
        this.elogioQueue = response.topics.elogio;
        this.sugestaoQueue = response.topics.sugestao;
        this.criticaQueue = response.topics.critica;

        this.mountStackedBarChart();
        this.mountPieChart();
        this.loading = false;
        this.animationDuration = 0;
      },
      error: (error: any) => {
        console.error('Erro ao chamar a API:', error);
      }
    });

    return sizeObservable;
  }

  consume(type: string) {
    this.apiService.info(type).subscribe({
      next: (response) => {
        console.log('consume():', response);
        this.loading = false;
        this.size().toPromise();

        if (response.messages.Messages){
          this.confirmConsume(type, response.messages.Messages[0].MessageId, response.messages.Messages[0].receiptHandle, JSON.parse(JSON.parse(response.messages.Messages[0].Body).Message).message);
        }
        else {
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Não há mensagens prontas para consumir!' });
        }
      },
      error: (error) => {
        console.error('Erro ao chamar a API:', error);
        this.loading = false;
      }
    });
  }
  confirmConsume(type: string, messageId: string, receiptHandle: string, message: any){
    this.confirmationService.confirm({
      message: `Deseja consumir o feedback ${type}: ${message}?`,
      header: messageId,
      icon: 'pi pi-info-circle',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record consumed' });
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      },
      key: 'positionDialog'
    });
  }

mountPieChart() {
  this.pieData = {
    labels: ['Elogios', 'Sugestões', 'Críticas'],
    datasets: [
      {
        data: [this.elogioQueue.totalSize, this.sugestaoQueue.totalSize, this.criticaQueue.totalSize],
        backgroundColor: ['rgba(34, 197, 93, 0.6)', 'rgba(245, 158, 12, 0.6)', 'rgba(239, 68, 68, 0.6)'],
        hoverBackgroundColor: ['rgba(34, 197, 93, 1)', 'rgba(245, 158, 12, 1)', 'rgba(239, 68, 68, 1)'],
        borderColor: ['rgba(90, 90, 90, 0.7)', 'rgba(90, 90, 90, 0.7)', 'rgba(90, 90, 90, 0.7)'],
        borderWidth: 1.2
      }
    ]
  };

  this.pieOptions = {
    animation: {
      duration: this.animationDuration
    },
    showTooltips: true,
    cutout: '0%',
    plugins: {
      legend: {
        labels: {
          color: this.textColor,
          generateLabels: (chart: any) => {
            const labels = chart.data.labels;
            const dataset = chart.data.datasets[0];
            const values = dataset.data;
            return labels.map((label: any, index: any) => {
              return {
                text: `${label}: ${values[index]}`,
                fillStyle: dataset.backgroundColor[index],
              };
            });
          }
        }
      }
    }
  };
}

mountStackedBarChart() {
  this.stackedData = {
    labels: ['Elogios', 'Sugestões', 'Críticas'],
    datasets: [
      {
        type: 'bar',
        label: 'Visible',
        data: [this.elogioQueue.ApproximateNumberOfMessages, this.sugestaoQueue.ApproximateNumberOfMessages, this.criticaQueue.ApproximateNumberOfMessages],
      },
      {
        type: 'bar',
        label: 'Not Visible',
        data: [this.elogioQueue.ApproximateNumberOfMessagesNotVisible, this.sugestaoQueue.ApproximateNumberOfMessagesNotVisible, this.criticaQueue.ApproximateNumberOfMessagesNotVisible]
      },
      {
        type: 'bar',
        label: 'Delayed',
        data: [this.elogioQueue.ApproximateNumberOfMessagesDelayed, this.sugestaoQueue.ApproximateNumberOfMessagesDelayed, this.criticaQueue.ApproximateNumberOfMessagesDelayed]
      },
    ]
  };

  this.stackedOptions = {
    animation: {
      duration: this.animationDuration
    },
    indexAxis: 'y',
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      tooltips: {
        mode: 'index',
        intersect: false
      },
      legend: {
        position: 'bottom',
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

getStorageMessages() {
  return localStorage.getItem('messages') ? JSON.parse(localStorage.getItem('messages') || '{}') : []
}

setStorageMessage(value: any) {
  this.messagesStorage = this.getStorageMessages();
  this.messagesStorage.push(value);
  return localStorage.setItem('messages', JSON.stringify(this.messagesStorage));
}

isValidJSON(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}
}