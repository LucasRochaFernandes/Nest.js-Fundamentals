import { Injectable } from '@nestjs/common'
import { Notification } from '../../../../app/entities/notification'
import { NotificationsRepository } from '../../../../app/repositories/notifications-repository'
import { PrismaService } from '../prisma.service'
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper'

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  // eslint-disable-next-line no-useless-constructor
  constructor(private prismaService: PrismaService) {}

  async countManyByRecipientId(recipientId: string): Promise<number> {
    const count = await this.prismaService.notification.count({
      where: {
        recipientId,
      },
    })
    return count
  }

  async findManyByRecipientId(recipientId: string): Promise<Notification[]> {
    const notifications = await this.prismaService.notification.findMany({
      where: {
        recipientId,
      },
    })
    return notifications.map((item) => PrismaNotificationMapper.toDomain(item))
  }

  async findById(notificationId: string): Promise<Notification | null> {
    const notification = await this.prismaService.notification.findUnique({
      where: {
        id: notificationId,
      },
    })
    if (!notification) {
      return null
    }
    return PrismaNotificationMapper.toDomain(notification)
  }

  async save(notification: Notification): Promise<void> {
    const raw = PrismaNotificationMapper.toPrisma(notification)
    await this.prismaService.notification.update({
      where: {
        id: raw.id,
      },
      data: raw,
    })
  }

  async create(notification: Notification): Promise<void> {
    const raw = PrismaNotificationMapper.toPrisma(notification)
    await this.prismaService.notification.create({
      data: raw,
    })
  }
}
