export class Contact {
    id: number;
    customer_name: string;
    phone: string;
    id_province: number;
    id_district: number;
    question: string;
    status: string;
    create_time: Date;
    code_sale: string;

    constructor(id: number, customer_name: string, phone: string, id_province: number, id_district: number, question: string, status: string, create_time: Date, code_sale: string) {
        this.id = id;
        this.customer_name = customer_name;
        this.phone = phone;
        this.id_province = id_province;
        this.id_district = id_district;
        this.question = question;
        this.status = status;
        this.create_time = create_time;
        this.code_sale = code_sale;
    }
}