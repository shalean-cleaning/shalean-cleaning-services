export interface PaystackConfig {
  publicKey: string;
  email: string;
  amount: number;
  currency?: string;
  reference?: string;
  metadata?: Record<string, any>;
  custom_fields?: Array<{
    display_name: string;
    variable_name: string;
    value: string;
  }>;
  callback?: (response: PaystackResponse) => void;
  onClose?: () => void;
}

export interface PaystackResponse {
  status: 'success' | 'error';
  message: string;
  reference: string;
  trans: string;
  trxref: string;
}

export interface PaymentData {
  bookingId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  reference: string;
  metadata: {
    bookingId: string;
    serviceName: string;
    serviceDescription?: string;
    customerId: string;
    cleanerId?: string;
    scheduledDate: string;
    scheduledTime: string;
    address: string;
    suburb?: string;
    region?: string;
    bedrooms?: string;
    bathrooms?: string;
    extras?: string;
    basePrice?: string;
    extrasPrice?: string;
    serviceFee?: string;
    total?: string;
  };
}

export interface PaymentResult {
  success: boolean;
  reference: string;
  transactionId: string;
  amount: number;
  currency: string;
  message: string;
  bookingId: string;
}

export interface PaymentError {
  code: string;
  message: string;
  details?: any;
}
