import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true, default: '' })
  description: string;

  @Prop({ enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @Prop()
  dueDate?: Date;

  // Every task is scoped to the user who owns it - enforced in the service layer
  @Prop({ type: Types.ObjectId, required: true, index: true })
  ownerId: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
