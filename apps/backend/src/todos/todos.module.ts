import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Todo, TodoSchema } from './todo.entity';
import { TodoRouter } from './todo.router';
import { TodosService } from './todos.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
    AuthModule,
  ],
  providers: [TodosService, TodoRouter],
})
export class TodosModule {}
