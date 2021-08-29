export class RequestClaimBenefit {
    id: number;
    id_request_claim_detail: number;
    name_benefit: string;

    constructor(id: number,
        id_request_claim_detail: number,
        name_benefit: string) {

        this.id = id;
        this.id_request_claim_detail = id_request_claim_detail;
        this.name_benefit = name_benefit;
    }
}