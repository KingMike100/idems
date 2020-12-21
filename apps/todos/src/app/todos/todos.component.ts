import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { TodoService } from "../services/todo.service"
import { FormControl, FormGroup, Validators} from "@angular/forms"
import {OnlineOfflineService } from "../services/online-offline.service"
@Component({
  selector: 'idems-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {

  todos;
  form: FormGroup;
  
  constructor(
    private http: HttpClient, 
    private todoService: TodoService,
    public readonly onlineOfflineServive: OnlineOfflineService
    ) { 
    this.form = new FormGroup({
      value: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.getTodos();
    console.log("Starting !!")
    this.todoService.syncDB();

  }

  getTodos(){
    this.todoService.getTodos().subscribe((data)=>{
      //this.todos = data;
      this.todos = data.changes
      console.log("todos object", data.changes)
    })
  }

  addTodo(){
    this.todoService.addTodo(this.form.value);
    this.form.reset();
    this.getTodos();
  }
}
