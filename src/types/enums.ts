// src/types/enums.ts

// ============================================
// REQUEST ENUMS (sent to backend as numbers)
// ============================================
// These are used in API requests where the backend expects numeric values

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
    SalonOwner = 2,
    SalonStaff = 3
}

export enum Gender {
    Male = 1,
    Female = 2,
    Other = 3
}

// ============================================
// RESPONSE ENUMS (returned from backend as strings)
// ============================================
// The backend uses JsonStringEnumConverter, so these enums are serialized as strings in responses

export enum AppointmentStatus {
    Pending = 'Pending',
    Approved = 'Approved',
    Completed = 'Completed',
    Cancelled = 'Cancelled',
    NoShow = 'NoShow'
}

export enum PaymentStatus {
    Paid = 'Paid',
    Unpaid = 'Unpaid',
    Upcoming = 'Upcoming',
    Draft = 'Draft',
    Late = 'Late'
}