export class Contact {
    id: number;
    phone: string;
    province: string;
    district: string;

    constructor(id: number, phone: string, province: string, district: string) {
        this.id = id;
        this.phone = phone;
        this.province = province;
        this.district = district;
    }
}