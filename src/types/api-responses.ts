export interface BusinessDetailsResponse {
    id: number;
    name: string;
    about: string;
    businessRegistrationNumber: string;
    isAlwaysOpen: boolean;
    isVerified: boolean;
    serviceType: string;
    location: {
        country: string;
        city: string;
        state: string;
        streetAddress: string;
        zipCode: string;
        hasHomeService: boolean;
        latitude: number;
        longitude: number;
    };
    businessHours: Array<{
        dayOfWeek: string;
        isOpen: boolean;
        openTime: string;
        closeTime: string;
        is24Hours: boolean;
    }>;
    categories: Array<{
        categoryId: number;
        name: string;
        isActive: boolean;
    }>;
}

export interface Category {
    id: number;
    name: string;
    imageUrl: string;
    isActive: boolean;
    approvalStatus: number;
}

export interface CategoryListResponse {
    categories: Category[];
    totalCount: number;
}

export interface RequestCategoryResponse {
    categoryId: number;
    name: string;
    approvalStatus: number;
}

export interface ServicePricingOption {
    name: string;
    price: number;
    currency: string;
    duration: string;
}

export interface CreateServiceResponse {
    serviceId: number;
    name: string;
    pricingOptions: ServicePricingOption[];
}

export interface LogoutResponse {
    success: boolean;
}

export interface AppointmentResponse {
    id: number;
    clientName: string;
    mobileNumber: string;
    email: string;
    serviceId: number;
    amount: number;
    appointmentDate: string;
    appointmentTime: string;
    isDraft: boolean;
    status: string;
}

export interface AppointmentService {
    serviceId: number;
    serviceName: string;
    categoryName: string;
    amount: number;
    duration: string;
}

export interface AppointmentDetails {
    id: number;
    serviceName: string;
    customerName: string;
    phoneNumber: string;
    email: string;
    appointmentDate: string;
    duration: string;
    servicePrice: number;
    paymentStatus: number;
    paymentStatusString: string;
    status: number;
    statusString: string;
    isDraft: boolean;
    staffId?: number;
    staffName?: string;
    isRegisteredCustomer: boolean;
}

export interface AppointmentListResponse {
    appointments: AppointmentDetails[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// Add to api-responses.ts
export interface BusinessStaffDto {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    position?: string;
    isActive: boolean;
    rating: number;
    totalRatings: number;
    schedules: StaffScheduleDto[];
}

export interface StaffScheduleDto {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}

export interface BusinessStaffListResponse {
    staff: BusinessStaffDto[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// Branch types
export interface BranchDto {
    id: number;
    name: string;
    address: string;
    primaryHeadQuarter: boolean;
    active: boolean;
    description: string;
    createdAt: string;
}

export interface BusinessBranchListResponse {
    branches: BranchDto[];
    totalCount: number;
}