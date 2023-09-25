import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private baseUrl = 'http://localhost:8080/api/v2';

    constructor() { }

    send(newItem: any): Observable<any> {
        const endpoint = `${this.baseUrl}/send`;

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
        };

        return new Observable((subscriber) => {
            fetch(endpoint, requestOptions)
                .then(response => response.json())
                .then(data => subscriber.next(data))
                .catch(error => subscriber.error(error));
        });
    }

    messages(type: any = ''): Observable<any> {
        const endpoint = `${this.baseUrl}/messages?queue=${type}`;

        return new Observable((subscriber) => {
            fetch(endpoint)
                .then(response => (response || {}).json())
                .then(data => subscriber.next(data))
                .catch(error => subscriber.error(error));
        });
    }

    size(): Observable<any> {
        const endpoint = `${this.baseUrl}/size`;

        return new Observable((subscriber) => {
            fetch(endpoint)
                .then(response => response.json())
                .then(data => subscriber.next(data))
                .catch(error => subscriber.error(error));
        });
    }

    remove(feedback_type: string, receiptHandle: string): Observable<any> {
        const endpoint = `${this.baseUrl}/remove?queue=${feedback_type}`;
        
        const requestOptions: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ receiptHandle: receiptHandle }),
        };

        return new Observable((subscriber) => {
            fetch(endpoint, requestOptions)
                .then(response => response)
                .then(data => subscriber.next(data))
                .catch(error => subscriber.error(error));
        });
    }
}
