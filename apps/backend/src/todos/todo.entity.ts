import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Todo extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ default: false })
  completed!: boolean;

  @Prop()
  dueDate?: string;

  @Prop({ enum: ['low', 'medium', 'high'] })
  priority?: 'low' | 'medium' | 'high';

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
