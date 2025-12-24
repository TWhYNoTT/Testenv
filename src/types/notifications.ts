export enum NotificationType {
    NewAppointment = 1,
    AppointmentCancelled = 2,
    AppointmentCompleted = 3,
    NewStaffJoined = 4,
    PromotionExpiring = 5,
    System = 6
}

export interface NotificationDto {
    id: number;
    title: string;
    message?: string;
    type: NotificationType;
    isRead: boolean;
    createdAt: string;
    referenceId?: number;
}

export interface NotificationListResponse {
    notifications: NotificationDto[];
    unreadCount: number;
}

export interface UnreadCountResponse {
    count: number;
}
