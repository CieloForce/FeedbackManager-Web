import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    axios: any;

    constructor() {
        this.axios = axios.create({
            baseURL: 'http://localhost:8080/'
        });
    }

    get(endpoint: string): Promise<any> {
        return this.axios.get(endpoint);
    }

    post(endpoint: string, data: any): Promise<any> {
        return this.axios.post(endpoint, data);
    }

    put(endpoint: string, data: any): Promise<any> {
        return this.axios.put(endpoint, data);
    }

    delete(endpoint: string): Promise<any> {
        return this.axios.delete(endpoint);
    }
}