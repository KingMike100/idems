import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http"
import { Todo } from '../models/todo'
import { Observable } from 'rxjs';
import Dexie from 'dexie'
import { OnlineOfflineService} from './online-offline.service'


import { HttpHeaders} from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})


export class TodoService {

  private todos;
  private db: any;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  
  constructor(private http: HttpClient, private readonly onlineOfflineService: OnlineOfflineService) { 
    this.registerToEvents(onlineOfflineService)
    this.createDatabase()
  }

  public getTodos(){
    const url = 'http://localhost:8080/todos'
    this.todos = this.http.get(url, this.httpOptions)
    return this.todos;

  }

  public addTodo(todoText){
    const url = 'http://localhost:8080/todos'
    const body = {"text": todoText.value}
    
    //check if user is not online
    if(!this.onlineOfflineService.isOnline){
      this.addToIndexedDb(body)
    }else{
      this.http.post<any>(url, body, this.httpOptions).subscribe({
        error: error =>{
          const errormsg = error.message;
          console.error('There was an error', errormsg)
        }
      })
    }
  }

  private registerToEvents(onlineOfflineService: OnlineOfflineService){
    onlineOfflineService.connectionChanged.subscribe(online =>{
      if(online){
        console.log("went online")
        console.log("sending all stored items")
        this.sendItemsFromIndexedDb()
      }else{
        console.log("went offline, storing in indexdb")
      }
    })
  }

  private createDatabase(){
    this.db = new Dexie('TodoDatabase')
    this.db.version(1).stores({
      todos: 'text'
    })
  }

  private addToIndexedDb(todo){
    this.db.todos
      .add(todo)
      .then(async () =>{
        const allItems: Todo[] = await this.db.todos.toArray();
        console.log("saved in IndexDB, IndexDB is now", allItems)
      })
      .catch(e=>{
        alert("Error: " + (e.stack || e))
      })
  }

  private async sendItemsFromIndexedDb(){
    const allItems: Todo[] = await this.db.todos.toArray();

    allItems.forEach((item: Todo) => {
      console.log("adding items", item)
      //will implement http request here
    })
  }
}