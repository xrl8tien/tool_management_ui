export class NotificationSetting {
    id: number;
    code_sale: string;
    date_setting: number;

    constructor(id: number,
        code_sale: string,
        date_setting: number) {
        this.id = id;
        this.code_sale = code_sale;
        this.date_setting = date_setting;
    }
}