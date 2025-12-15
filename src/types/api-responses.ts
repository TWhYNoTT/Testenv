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
    /** ISO 8601 datetime string with Z suffix (UTC). Example: "2024-12-07T17:30:00Z" */
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
    /** ISO 8601 datetime string with Z suffix (UTC). Example: "2024-12-07T17:30:00Z"
     * Use new Date(appointmentDate) to parse, then use local timezone methods (toLocaleDateString, toLocaleTimeString, etc.)
     */
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
    gender?: number;
    phoneNumber: string;
    role?: number; // 1 = StaffManager, 2 = Staff
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
    // Address fields
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    // GPS coordinates for map integration
    latitude?: number;
    longitude?: number;
    // Phone number - internal use only, not displayed to customers
    phoneNumber: string;
    primaryHeadQuarter: boolean;
    active: boolean;
    description: string;
    createdAt: string;
}

export interface BusinessBranchListResponse {
    branches: BranchDto[];
    totalCount: number;
}

// Dashboard
export interface DashboardSummaryResponse {
    totalAppointments: number;
    employees: number;
    activeBranches: number;
    bookingsRevenue: {
        labels: string[];
        bookings: number[];
        amounts: number[];
        totalRevenue: number;
        reservationRate: number; // percent
    };
    revenueSeries: {
        labels: string[];
        data: number[];
        year: number;
    };
    appointmentStats: {
        labels: string[];
        values: number[]; // percentage ints
    };
}

// Promotion types
export enum DiscountType {
    Percentage = 1,
    FixedAmount = 2
}

export enum CouponCodeType {
    Alphanumeric = 1,
    Numeric = 2
}

export type PromotionType = 'DiscountedDates' | 'ServiceLevel' | 'Coupon';

export interface PromotionDto {
    id: number;
    businessId: number;
    branchId?: number;
    branchName?: string;
    discountValue: number;
    discountType: DiscountType;
    isActive: boolean;
    promotionType: PromotionType;
    // Stored promotion name (for DiscountedDates and ServiceLevel)
    promotionName?: string;
    // Display name (uses promotionName if available)
    name: string;
    information: string;
    // DiscountedDates specific
    startDate?: string;
    endDate?: string;
    // ServiceLevel specific
    serviceId?: number;
    serviceName?: string;
    minimumAmount?: number;
    // Coupon specific
    couponName?: string;
    couponCode?: string;
    couponQuantity?: number;
    couponUsedCount?: number;
    expiryDate?: string;
    codeType?: CouponCodeType;
}

export interface PromotionListResponse {
    promotions: PromotionDto[];
    totalCount: number;
}