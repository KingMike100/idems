import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'idems-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {

  todos;
  
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getTodos();

  }

  getTodos(){
    const url = 'http://localhost:8080/todos'
  this.http.get(url,{headers:{"content-type":"application/json"}}).subscribe((data)=>{
    this.todos = data;
     console.log("data", this.todos)
   })
  }
}
