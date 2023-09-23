import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private baseUrl = 'http://localhost:3333';

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

    info(type: any = ''): Observable<any> {
        const endpoint = `${this.baseUrl}/info/${type}`;

        return new Observable((subscriber) => {
            fetch(endpoint)
                .then(response => response.json())
                .then(data => subscriber.next(data))
                .catch(error => subscriber.error(error));
        });
    }

    size(): Observable<any> {
        const endpoint = `${this.baseUrl}/size/`;

        return new Observable((subscriber) => {
            fetch(endpoint)
                .then(response => response.json())
                .then(data => subscriber.next(data))
                .catch(error => subscriber.error(error));
        });
    }

    purge(id: any): Observable<any> {
        const endpoint = `${this.baseUrl}/purge/${id}`;

        const requestOptions: RequestInit = {
            method: 'DELETE',
        };

        return new Observable((subscriber) => {
            fetch(endpoint, requestOptions)
                .then(response => response.json())
                .then(data => subscriber.next(data))
                .catch(error => subscriber.error(error));
        });
    }
}
