export class Kpi {
    id: number;
    code_employee: string;
    target: number;
    create_time: Date;

    constructor(id: number,
        code_employee: string,
        target: number,
        create_time: Date) {
        this.id = id;
        this.code_employee = code_employee;
        this.target = target;
        this.create_time = create_time;
    }
}