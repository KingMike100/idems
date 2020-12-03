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
  private url = 'http://localhost:8080/todos'


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
    this.todos = this.http.get(this.url, this.httpOptions)
    return this.todos;

  }

  public addTodo(todoText){
    const body = {"text": todoText.value}
    
    //check if user is not online
    if(!this.onlineOfflineService.isOnline){
      this.addToIndexedDb(body)
    }else{
      this.http.post<any>(this.url, body, this.httpOptions).subscribe(
        result =>{
          console.log("result", result)
        },
        error =>{
          console.error('There was an error', error)
        }
      )
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
     this.http.post<any>(this.url, item, this.httpOptions).subscribe(
      result =>{
        this.db.todos.delete(item.text).then(()=>{
          console.log("Item Sent and deleted locally")
        })
      },
      error =>{
        console.error('There was an error', error)
      }
    )
  
    })
  }
}