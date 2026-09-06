// supabase/functions/send-confirmation-email/templates/types.ts

export interface EmailItem {
    name: string;
    quantity: number;
    price: string;
}

export interface OrderEmailData {
    customer_name: string;
    order_id: string;
    order_total: string;
    transaction_id: string;
    items: EmailItem[];
    order_date: string;
    from_email: string;
    current_year: string;
}

export interface RenderedEmail {
    subject: string;
    html: string;
}
