import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TRPCModule } from 'nestjs-trpc';
import { AuthModule } from './auth/auth.module';
import { TodosModule } from './todos/todos.module';
import { TrpcContextService } from './trpc/trpc-context.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.NODE_ENV === 'production'
        ? process.env.MONGO_URL!
        : 'mongodb://localhost:28028/todos_local',
    ),
    TRPCModule.forRoot({
      autoSchemaFile:
        process.env.NODE_ENV === 'production'
          ? '/tmp/trpc-schema.ts'
          : '../../packages/trpc/src/server',
      context: TrpcContextService,
    }),
    AuthModule,
    TodosModule,
  ],
  controllers: [],
  providers: [TrpcContextService],
})
export class AppModule {}
