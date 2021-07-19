export class CustomerInfoDTO {
    codes_saler: Array<string>;
    dateFrom: string;
    dateTo: string;
    searchValue: string;

    constructor(codes_saler: Array<string>,
        dateFrom: string,
        dateTo: string,
        searchValue: string) {
        this.codes_saler = codes_saler;
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
        this.searchValue = searchValue;
    }
}