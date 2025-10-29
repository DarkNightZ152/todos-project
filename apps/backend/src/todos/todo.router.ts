import { Injectable } from '@nestjs/common';
import { Ctx, Input, Mutation, Query, Router } from 'nestjs-trpc';
import { z } from 'zod';
import { AuthHelperService } from '../auth/services/auth-helper.service';
import { TrpcContextType } from '../trpc/trpc-context.service';
import { CreateTodoInput, createTodoSchema, todoSchema } from './todo.schema';
import { TodosService } from './todos.service';

@Injectable()
@Router({ alias: 'todo' })
export class TodoRouter {
  constructor(
    private readonly todosService: TodosService,
    private readonly authHelper: AuthHelperService,
  ) {}

  @Query({
    input: z.object({ id: z.string() }),
    output: todoSchema,
  })
  async getTodoById(@Input('id') id: string, @Ctx() ctx: TrpcContextType) {
    const user = await this.authHelper.verifyRequest(ctx.req);
    return this.todosService.getTodoById(id, user.userId);
  }

  @Query({
    output: z.array(todoSchema),
  })
  async getAllTodos(@Ctx() ctx: TrpcContextType) {
    const user = await this.authHelper.verifyRequest(ctx.req);
    return this.todosService.getAllTodos(user.userId);
  }

  @Mutation({
    input: createTodoSchema,
    output: todoSchema,
  })
  async createTodo(
    @Input() todoData: CreateTodoInput,
    @Ctx() ctx: TrpcContextType,
  ) {
    const user = await this.authHelper.verifyRequest(ctx.req);
    return this.todosService.createTodo(todoData, user.userId);
  }

  @Mutation({
    input: z.object({
      id: z.string(),
      data: createTodoSchema.partial(),
    }),
    output: todoSchema,
  })
  async updateTodo(
    @Input('id') id: string,
    @Input('data') data: Partial<CreateTodoInput>,
    @Ctx() ctx: TrpcContextType,
  ) {
    const user = await this.authHelper.verifyRequest(ctx.req);
    return this.todosService.updateTodo(id, data, user.userId);
  }

  @Mutation({
    input: z.object({
      id: z.string(),
    }),
    output: z.boolean(),
  })
  async deleteTodo(@Input('id') id: string, @Ctx() ctx: TrpcContextType) {
    const user = await this.authHelper.verifyRequest(ctx.req);
    return this.todosService.deleteTodo(id, user.userId);
  }
}
