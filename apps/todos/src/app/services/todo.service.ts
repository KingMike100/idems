import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http"
import { Todo } from '../models/todo'
import { Observable } from 'rxjs';
import Dexie from 'dexie'
import SyncClient from 'sync-client'
import 'dexie-syncable';
import 'dexie-observable'
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
  
  constructor(private http: HttpClient) { 

  }

  public syncDB(){
    console.log("Starting Dexie!!")

    const databaseName = 'MyTodos';
    const versions = [{
      version: 1,
      stores:{
        todos: 'id,text'
      }
    }]
    let options = { pollInterval: 1000}

    const syncClient = new SyncClient(databaseName, versions)

    console.log("connecting to sync server!!")

    syncClient.connect("http://localhost:8080/todos", options).then(()=> {
      console.log("Connected Successfully")

    }, error =>{
        console.error("Connection error: " + error);

    }).catch(err => {
      console.error("Connection error: "+ err)
    })

    
    syncClient.statusChange(this.url, (newStatus)=>{
      console.log("Sync Status changed: " + newStatus)
    })

   /*
    syncClient.transaction('rw', syncClient.todos,  () =>{
      syncClient.todos.put({text: "December 16th"}).then(() => {
        console.log ('todo updated ');

      });  
  });
*/
  }

  public getTodos(){
    this.todos = this.http.get(this.url, this.httpOptions)
    return this.todos;

  }

  public addTodo(todoText){
    const body = {"text": todoText.value}
 
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