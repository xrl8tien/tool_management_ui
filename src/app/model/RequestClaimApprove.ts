export class RequestClaimApprove {
    id: number;
    name: string;
    date: Date;
    code_sender: string;
    description: string;
    id_contract: number;
    id_request: number;
    status: string;
    main_benefit: string;
    amount_main: number;
    sub_benefit: string;
    amount_sub: number;

    constructor(id: number,
        name: string,
        date: Date,
        code_sender: string,
        description: string,
        id_contract: number,
        id_request: number,
        status: string,
        main_benefit: string,
        amount_main: number,
        sub_benefit: string,
        amount_sub: number) {

        this.id = id;
        this.name = name;
        this.date = date;
        this.code_sender = code_sender;
        this.description = description;
        this.id_contract = id_contract;
        this.id_request = id_request;
        this.status = status;
        this.main_benefit = main_benefit;
        this.amount_main = amount_main;
        this.sub_benefit = sub_benefit;
        this.amount_sub = amount_sub;
    }
}