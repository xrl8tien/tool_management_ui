export class DistrictDTO {
    id: number;
    name: string;
    type: string;
    id_province: number;
    codes_sale: Array<string>;

    constructor(id: number,
        name: string,
        type: string,
        id_province: number,
        codes_sale: Array<string>) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.id_province = id_province;
        this.codes_sale = codes_sale;
    }
}