import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http"
import { Todo } from '../models/todo'
import { Observable } from 'rxjs';
import { OnlineOfflineService} from './online-offline.service'


import { HttpHeaders} from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})


export class TodoService {

  private todos;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  
  constructor(private http: HttpClient, private readonly onlineOfflineService: OnlineOfflineService) { 

  }

  public getTodos(){
    const url = 'http://localhost:8080/todos'
    this.todos = this.http.get(url, this.httpOptions)
    return this.todos;

  }

  public addTodo(todoText){
    const url = 'http://localhost:8080/todos'
    const body = {"text": todoText.value}
    this.http.post<any>(url, body, this.httpOptions).subscribe({
      error: error =>{
        const errormsg = error.message;
        console.error('There was an error', errormsg)
      }
    })
    
  }

  
}