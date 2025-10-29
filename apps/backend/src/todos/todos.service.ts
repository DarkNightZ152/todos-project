import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './todo.entity';
import { CreateTodoInput } from './todo.schema';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  async getTodoById(id: string, userId: string) {
    const todo = await this.todoModel.findOne({ _id: id, userId }).exec();
    if (!todo) {
      throw new NotFoundException('Todo not found.');
    }
    return this.mapTodoToResponse(todo);
  }

  async getAllTodos(userId: string) {
    const todos = await this.todoModel.find({ userId }).exec();
    return todos.map((todo) => this.mapTodoToResponse(todo));
  }

  async createTodo(todoData: CreateTodoInput, userId: string) {
    const todo = new this.todoModel({ ...todoData, userId });
    const savedTodo = await todo.save();
    return this.mapTodoToResponse(savedTodo);
  }

  async updateTodo(id: string, data: Partial<CreateTodoInput>, userId: string) {
    const todo = await this.todoModel
      .findOneAndUpdate({ _id: id, userId }, data, { new: true })
      .exec();
    if (!todo) {
      throw new NotFoundException('Todo not found.');
    }
    return this.mapTodoToResponse(todo);
  }

  async deleteTodo(id: string, userId: string) {
    const result = await this.todoModel
      .findOneAndDelete({ _id: id, userId })
      .exec();
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
