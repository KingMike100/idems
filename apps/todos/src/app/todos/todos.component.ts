import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { TodoService } from "../todo.service"

@Component({
  selector: 'idems-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {

  todos;
  
  constructor(private http: HttpClient, private todoService: TodoService) { }

  ngOnInit(): void {
    this.getTodos();

  }

  getTodos(){
    this.todoService.getTodos().subscribe((data)=>{
      this.todos = data;
    })
  }

  addTodo(){

  }
}
