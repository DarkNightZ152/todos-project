import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TRPCModule } from 'nestjs-trpc';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGO_URL || 'mongodb://localhost:28028/todos_local',
    ),
    TRPCModule.forRoot({
      autoSchemaFile: '../../packages/trpc/src/server',
    }),
    TodosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
