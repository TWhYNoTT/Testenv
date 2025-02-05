// src/types/enums.ts

export enum BusinessType {
    Men = 1,
    Women = 2,
    Both = 3
}

export enum ServiceType {
    MenOnly = 1,
    WomenOnly = 2,
    Everyone = 3
}

export enum ProfileType {
    Customer = 1,
    SalonOwner = 2
}

export enum Gender {
    Male = 1,
    Female = 2
}

export enum AppointmentStatus {
    Upcoming = 0,
    Paid = 1,
    Late = 2,
    Unpaid = 3,
    Draft = 6
}