import { Injectable } from '@nestjs/common';

interface Notification {
  message: string;
  createdAt: Date;
}

@Injectable()
export class NotificationsService {
  // In-memory for now - deliberately isolated behind this service so it can
  // be swapped for email/push/websockets later without touching TasksService
  private store = new Map<string, Notification[]>();

  notify(userId: string, message: string) {
    const existing = this.store.get(userId) || [];
    existing.unshift({ message, createdAt: new Date() });
    this.store.set(userId, existing.slice(0, 50));
  }

  getForUser(userId: string) {
    return this.store.get(userId) || [];
  }
}
