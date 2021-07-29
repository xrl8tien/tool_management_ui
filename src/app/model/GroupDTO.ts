export class GroupDTO {
    id: number;
    code_sale_executive: string;
    type: string;
    name: string;

    constructor(id: number, code_sale_executive: string, type: string, name: string) {
        this.id = id;
        this.code_sale_executive = code_sale_executive;
        this.type = type;
        this.name = name;
    }
}