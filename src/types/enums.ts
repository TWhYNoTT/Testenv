export enum ProfileType {
    Customer = 1,
    SalonOwner = 2
}

export enum Gender {
    Male = 1,
    Female = 2
}

export enum ServiceType {
    MenOnly = 1,
    WomenOnly = 2,
    Everyone = 3
}

export enum BusinessType {
    Men = 1,
    Women = 2,
    Both = 3
}

export enum SessionStatus {
    Active = 1,
    Expired = 2,
    Revoked = 3,
    LoggedOut = 4
}

export enum TokenType {
    VerificationCode = 1,
    VerificationLink = 2,
    ResetCodeInitial = 3,
    ResetCodeFinal = 4,
    ResetLink = 5
}

export enum ApprovalStatus {
    Pending = 1,
    Approved = 2,
    Rejected = 3
}
