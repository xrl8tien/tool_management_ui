export class ContactDTO {
    ids: Array<number>;
    dateFrom: string;
    dateTo: string;
    searchValue: string;

    constructor(ids: Array<number>,
        dateFrom: string,
        dateTo: string,
        searchValue: string) {
        this.ids = ids;
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
        this.searchValue = searchValue;
    }
}