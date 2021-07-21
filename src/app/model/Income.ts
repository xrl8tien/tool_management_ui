export class Income{
    id:number;
    description:string;
    income:number;
    revenue_val:number;
    start_time:Date;
    end_time:Date;
    create_time:Date;
    code_em_support:string;

    constructor(id:number,
        description:string,
        income:number,
        revenue_val:number,
        start_time:Date,
        end_time:Date,
        create_time:Date,
        code_em_support:string){
            this.id = id;
            this.description = description;
            this.income = income;
            this.revenue_val = revenue_val;
            this.start_time = start_time;
            this.end_time = end_time;
            this.create_time = create_time;
            this.code_em_support = code_em_support;
        }
}