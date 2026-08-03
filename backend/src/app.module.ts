import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/taskhub',
    ),
    // Each feature module owns its own routes, schema, and business logic.
    // Modules only talk to each other through exported providers - never
    // by reaching into another module's internals directly.
    UsersModule,
    AuthModule,
    TasksModule,
    NotificationsModule,
  ],
})
export class AppModule {}
