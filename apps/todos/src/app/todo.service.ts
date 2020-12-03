import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { getLocaleExtraDayPeriods } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  todos;

  constructor(private http: HttpClient) { }

  public getTodos(){
    const url = 'http://localhost:8080/todos'
    this.todos = this.http.get(url,{headers:{"content-type":"application/json"}})
    return this.todos;

  }

}