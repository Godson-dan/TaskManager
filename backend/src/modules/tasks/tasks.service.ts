import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument, TaskStatus } from './schemas/task.schema';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    // Tasks depends on Notifications - not the other way around - to keep
    // the dependency graph a one-way street between modules
    private notificationsService: NotificationsService,
  ) {}

  async create(ownerId: string, dto: CreateTaskDto) {
    const task = new this.taskModel({ ...dto, ownerId: new Types.ObjectId(ownerId) });
    const saved = await task.save();
    this.notificationsService.notify(ownerId, `Task created: "${saved.title}"`);
    return saved;
  }

  async findAllForUser(ownerId: string) {
    return this.taskModel.find({ ownerId: new Types.ObjectId(ownerId) }).sort({ createdAt: -1 }).exec();
  }

  async findOneForUser(taskId: string, ownerId: string) {
    const task = await this.taskModel.findById(taskId).exec();
    if (!task) throw new NotFoundException('Task not found');
    this.assertOwnership(task, ownerId);
    return task;
  }

  async update(taskId: string, ownerId: string, dto: UpdateTaskDto) {
    const task = await this.findOneForUser(taskId, ownerId);
    Object.assign(task, dto);
    const saved = await task.save();
    if (dto.status === TaskStatus.DONE) {
      this.notificationsService.notify(ownerId, `Task completed: "${saved.title}"`);
    }
    return saved;
  }

  async remove(taskId: string, ownerId: string) {
    const task = await this.findOneForUser(taskId, ownerId);
    await task.deleteOne();
    return { deleted: true };
  }

  private assertOwnership(task: TaskDocument, ownerId: string) {
    if (task.ownerId.toString() !== ownerId) {
      throw new ForbiddenException('You do not have access to this task');
    }
  }
}
