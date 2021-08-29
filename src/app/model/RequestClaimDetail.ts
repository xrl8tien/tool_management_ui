export class RequestClaimDetail {
    id: number;
    id_request: number;
    time_death: Date;
    cause_death: string;
    place_death: string;
    time_accident: Date;
    cause_accident: string;
    place_accident: string;
    injury_status: string;
    name_writer: string;
    dob_writer: Date;
    card_id_writer: string;
    address_writer: string;
    phone_writer: string;
    email_writer: string;
    main_benefit: string;
    sub_benefit: string;

    constructor(id: number,
        id_request: number,
        time_death: Date,
        cause_death: string,
        place_death: string,
        time_accident: Date,
        cause_accident: string,
        place_accident: string,
        injury_status: string,
        name_writer: string,
        dob_writer: Date,
        card_id_writer: string,
        address_writer: string,
        phone_writer: string,
        email_writer: string,
        main_benefit: string,
        sub_benefit: string) {

        this.id = id;
        this.id_request = id_request;
        this.time_death = time_death;
        this.cause_death = cause_death;
        this.place_death = place_death;
        this.time_accident = time_accident;
        this.cause_accident = cause_accident;
        this.place_accident = place_accident;
        this.injury_status = injury_status;
        this.name_writer = name_writer;
        this.dob_writer = dob_writer;
        this.card_id_writer = card_id_writer;
        this.address_writer = address_writer;
        this.phone_writer = phone_writer;
        this.email_writer = email_writer;
        this.main_benefit = main_benefit;
        this.sub_benefit = sub_benefit;
    }
}