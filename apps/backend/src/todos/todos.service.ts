import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './todo.entity';
import { CreateTodoInput } from './todo.schema';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  async getTodoById(id: string) {
    const todo = await this.todoModel.findById(id).exec();
    if (!todo) {
      throw new NotFoundException('Todo not found.');
    }
    return this.mapTodoToResponse(todo);
  }

  async getAllTodos() {
    const todos = await this.todoModel.find().exec();
    return todos.map((todo) => this.mapTodoToResponse(todo));
  }

  async createTodo(todoData: CreateTodoInput) {
    const todo = new this.todoModel(todoData);
    const savedTodo = await todo.save();
    return this.mapTodoToResponse(savedTodo);
  }

  async updateTodo(id: string, data: Partial<CreateTodoInput>) {
    const todo = await this.todoModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!todo) {
      throw new NotFoundException('Todo not found.');
    }
    return this.mapTodoToResponse(todo);
  }

  async deleteTodo(id: string) {
    const result = await this.todoModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Todo not found.');
    }
    return true;
  }

  private mapTodoToResponse(todo: Todo) {
    return {
      id: String(todo._id),
      name: todo.name,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.createdAt?.toISOString() || new Date().toISOString(),
      dueDate: todo.dueDate,
      priority: todo.priority,
    };
  }
}
