import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { TodoService } from "../services/todo.service"
import { FormControl, FormGroup, Validators} from "@angular/forms"

@Component({
  selector: 'idems-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {

  todos;
  form: FormGroup;
  
  constructor(private http: HttpClient, private todoService: TodoService) { 
    this.form = new FormGroup({
      value: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.getTodos();

  }

  getTodos(){
    this.todoService.getTodos().subscribe((data)=>{
      this.todos = data;
    })
  }

  addTodo(){
    this.todoService.addTodo(this.form.value);
    this.form.reset();
    this.getTodos();
  }
}
