import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CustomerNotification } from 'src/app/model/CustomerNotification';
import { Request } from 'src/app/model/Request';
import { RequestClaimApprove } from 'src/app/model/RequestClaimApprove';
import { RequestClaimDetail } from 'src/app/model/RequestClaimDetail';
import { RequestMedicalInformation } from 'src/app/model/RequestMedicalInformation';
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root'
})
export class ContractrequestService {

  constructor(private httpClient: HttpClient, private common: CommonService, private route: Router) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: 'my-auth-token',
    }),
  }

  //contract request
  public getAllContractRequest(code_appraiser: string): Observable<any> {
    const url = this.common.makeUrl("/request/get_all_request");
    return this.httpClient
      .post<any>(url, code_appraiser, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public searchAllContractRequest(code_appraiser: string, dateFrom: String, dateTo: String, searchValue: String): Observable<any> {
    let data = { code_appraiser: code_appraiser, dateFrom: dateFrom, dateTo: dateTo, searchValue: searchValue };
    const url = this.common.makeUrl("/request/search_all_request");
    return this.httpClient
      .post<any>(url, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public getAllContractRequestApproval(code_appraiser: string): Observable<any> {
    const url = this.common.makeUrl("/request/get_all_request_approval");
    return this.httpClient
      .post<any>(url, code_appraiser, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public searchAllContractRequestApproval(code_appraiser: string, dateFrom: String, dateTo: String, searchValue: String): Observable<any> {
    let data = { code_appraiser: code_appraiser, dateFrom: dateFrom, dateTo: dateTo, searchValue: searchValue };
    const url = this.common.makeUrl("/request/search_all_request_approval");
    return this.httpClient
      .post<any>(url, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  //add and get request
  public getOneContractRequest(id: number) {
    const url = this.common.makeUrl("/request/get_detail_request");
    return this.httpClient
      .post<any>(url, id, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public getDetailClaimRequest(id: number) {
    const url = this.common.makeUrl("/request/get_detail_claim_request");
    return this.httpClient
      .post<any>(url, id, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public addOneRequest(req: Request) {
    const url = this.common.makeUrl("/request/add_one_request");
    return this.httpClient
      .post<any>(url, req, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public addOneRequestClaimDetail(requestClaimDetail: RequestClaimDetail) {
    const url = this.common.makeUrlForCustomer("/request/add_one_request_claim_detail");
    return this.httpClient
      .post<any>(url, requestClaimDetail, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public addOneRequestMedicalInformation(requestMedicalInformation: RequestMedicalInformation) {
    const url = this.common.makeUrlForCustomer("/request/add_one_request_medical_information");
    return this.httpClient
      .post<any>(url, requestMedicalInformation, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public getRequestClaimDetail(id_request: number) {
    const url = this.common.makeUrlForCustomer("/request/get_request_claim_detail");
    return this.httpClient
      .post<any>(url, id_request, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public getRequestMedicalInformation(id_request_claim_detail: number) {
    const url = this.common.makeUrlForCustomer("/request/get_request_medical_information");
    return this.httpClient
      .post<any>(url, id_request_claim_detail, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public addClaimRequest(reqClaim: RequestClaimApprove) {
    const url = this.common.makeUrl("/request/add_claim_request");
    return this.httpClient
      .post<any>(url, reqClaim, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public addOneNotification(noti: CustomerNotification) {
    const url = this.common.makeUrl("/request/add_one_notification");
    return this.httpClient
      .post<any>(url, noti, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public setStatusRequest(id_request: number, description: String, approval_status: string): Observable<any> {
    const url = this.common.makeUrl("/request/set_status_request");
    let data = { id_request: id_request, description: description, approval_status };
    return this.httpClient
      .post<any>(url, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public setStatusClaimRequest(id: number, description: String, approval_status: string): Observable<any> {
    const url = this.common.makeUrl("/request/set_status_claim_request");
    let data = { id: id, description: description, approval_status };
    return this.httpClient
      .post<any>(url, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  //claim request
  public getAllClaimRequest(code_appraiser: string): Observable<any> {
    const url = this.common.makeUrl("/request/get_all_claim_request");
    return this.httpClient
      .post<any>(url, code_appraiser, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public searchAllClaimRequest(code_appraiser: string, dateFrom: String, dateTo: String, searchValue: String): Observable<any> {
    let data = { code_appraiser: code_appraiser, dateFrom: dateFrom, dateTo: dateTo, searchValue: searchValue };
    const url = this.common.makeUrl("/request/search_all_claim_request");
    return this.httpClient
      .post<any>(url, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public getAllClaimRequestApproval(code_appraiser: string): Observable<any> {
    const url = this.common.makeUrl("/request/get_all_claim_request_approval");
    return this.httpClient
      .post<any>(url, code_appraiser, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public searchAllClaimRequestApproval(code_appraiser: string, dateFrom: String, dateTo: String, searchValue: String): Observable<any> {
    let data = { code_appraiser: code_appraiser, dateFrom: dateFrom, dateTo: dateTo, searchValue: searchValue };
    const url = this.common.makeUrl("/request/search_all_claim_request_approval");
    return this.httpClient
      .post<any>(url, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  //manager
  public getAllCheckManagerReq(code_appraiser: string): Observable<any> {
    const url = this.common.makeUrl("/request/get_all_check_manager_req");
    return this.httpClient
      .post<any>(url, code_appraiser, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public searchAllCheckManagerReq(code_appraiser: string, dateFrom: String, dateTo: String, searchValue: String): Observable<any> {
    let data = { code_appraiser: code_appraiser, dateFrom: dateFrom, dateTo: dateTo, searchValue: searchValue };
    const url = this.common.makeUrl("/request/search_all_check_manager_req");
    return this.httpClient
      .post<any>(url, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public getAllApprovalManagerReq(code_appraiser: string): Observable<any> {
    const url = this.common.makeUrl("/request/get_all_approval_manager_req");
    return this.httpClient
      .post<any>(url, code_appraiser, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public searchAllApprovalManagerReq(code_appraiser: string, dateFrom: String, dateTo: String, searchValue: String): Observable<any> {
    let data = { code_appraiser: code_appraiser, dateFrom: dateFrom, dateTo: dateTo, searchValue: searchValue };
    const url = this.common.makeUrl("/request/search_all_approval_manager_req");
    return this.httpClient
      .post<any>(url, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public getAllUncheckManagerReq(code_appraiser: string): Observable<any> {
    const url = this.common.makeUrl("/request/get_all_uncheck_manager_req");
    return this.httpClient
      .post<any>(url, code_appraiser, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public searchAllUncheckManagerReq(code_appraiser: string, dateFrom: String, dateTo: String, searchValue: String): Observable<any> {
    let data = { code_appraiser: code_appraiser, dateFrom: dateFrom, dateTo: dateTo, searchValue: searchValue };
    const url = this.common.makeUrl("/request/search_all_uncheck_manager_req");
    return this.httpClient
      .post<any>(url, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public getAllApprovedClaimRequest(code_appraiser: string): Observable<any> {
    const url = this.common.makeUrl("/request/get_all_approved_claim_request");
    return this.httpClient
      .post<any>(url, code_appraiser, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public searchAllApprovedClaimRequest(code_appraiser: string, dateFrom: String, dateTo: String, searchValue: String): Observable<any> {
    let data = { code_appraiser: code_appraiser, dateFrom: dateFrom, dateTo: dateTo, searchValue: searchValue };
    const url = this.common.makeUrl("/request/search_all_approved_claim_request");
    return this.httpClient
      .post<any>(url, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
