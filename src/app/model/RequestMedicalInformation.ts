export class RequestMedicalInformation {
    id: number;
    id_request_claim_detail: number;
    date_in: Date;
    date_out: Date;
    diagnosis_disease: string;
    name_hospital: string;

    constructor(id: number,
        id_request_claim_detail: number,
        date_in: Date,
        date_out: Date,
        diagnosis_disease: string,
        name_hospital: string) {

        this.id = id;
        this.id_request_claim_detail = id_request_claim_detail;
        this.date_in = date_in;
        this.date_out = date_out;
        this.diagnosis_disease = diagnosis_disease;
        this.name_hospital = name_hospital;
    }
}