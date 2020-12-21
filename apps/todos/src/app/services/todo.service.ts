import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http"
import { Todo } from '../models/todo'
import { Observable } from 'rxjs';
import Dexie from 'dexie'
import { UUID } from 'angular2-uuid'
import SyncClient from 'sync-client'
import 'dexie-syncable';
import 'dexie-observable'
import { OnlineOfflineService} from './online-offline.service'


import { HttpHeaders} from "@angular/common/http"

const databaseName = 'MyTodos';
    const versions = [{
      version: 1,
      stores:{
        todos: 'id,text'
      }
    }]
    let options = { pollInterval: 1000, table:"todos"}

const syncClient = new SyncClient(databaseName, versions)

@Injectable({
  providedIn: 'root'
})

export class TodoService {

  private todos;
  private db: any;
  private url = 'http://localhost:3000'

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  
  constructor(private http: HttpClient) { 

  }

  public syncDB(){
    console.log("Starting Dexie!!")

    

    console.log("connecting to sync server!!")

    syncClient.connect("http://localhost:3000", options).then(()=> {
      console.log("Connected Successfully")

    }, error =>{
        console.error("Connection error: " + error);

    }).catch(err => {
      console.error("Connection error: "+ err)
    })

    
    syncClient.statusChange(this.url, (newStatus)=>{
      console.log("Sync Status changed: " + newStatus)
    })
    
  }

  public getTodos(){
    this.todos = this.http.get(this.url, this.httpOptions)
    return this.todos;

  }

  public addTodo(todoText){
    
    const body = {
      "id": UUID.UUID(),
      "text": todoText.value
    
    }
    
    syncClient.transaction('rw', syncClient.todos,  () =>{
      syncClient.todos.put(body).then(() => {
        console.log ('todo added ');
      });  
  });
    
    /*
      this.http.post<any>(this.url, body, this.httpOptions).subscribe(
        result =>{
          console.log("result", result)
        },
        error =>{
          console.error('There was an error', error)
        }
      )
      */
    }
}