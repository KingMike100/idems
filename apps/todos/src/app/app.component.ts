import { Component } from '@angular/core';
import { TodosComponent} from './todos/todos.component'

@Component({
  selector: 'idems-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'todos';
}
