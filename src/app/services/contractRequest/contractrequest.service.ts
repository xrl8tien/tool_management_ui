import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Request } from 'src/app/model/Request';
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root'
})
export class ContractrequestService {

  constructor(private httpClient: HttpClient, private common: CommonService,private route: Router) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: 'my-auth-token',
    }),
  }

  public getAllContractRequest(code_appraiser:string): Observable<any>{
    const url = this.common.makeUrl("/request/get_all_request");
    return this.httpClient
    .post<any>(url,code_appraiser,this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  public searchAllContractRequest(code_appraiser:string,dateFrom:String,dateTo:String,searchValue:String): Observable<any>{
  let data = {code_appraiser:code_appraiser,dateFrom:dateFrom,dateTo:dateTo,searchValue:searchValue};
    const url = this.common.makeUrl("/request/search_all_request");
    return this.httpClient
    .post<any>(url,data,this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  public getAllContractRequestApproval(code_appraiser:string): Observable<any>{
    const url = this.common.makeUrl("/request/get_all_request_approval");
    return this.httpClient
    .post<any>(url,code_appraiser,this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  public searchAllContractRequestApproval(code_appraiser:string,dateFrom:String,dateTo:String,searchValue:String): Observable<any>{
    let data = {code_appraiser:code_appraiser,dateFrom:dateFrom,dateTo:dateTo,searchValue:searchValue};
    const url = this.common.makeUrl("/request/search_all_request_approval");
    return this.httpClient
    .post<any>(url,data,this.httpOptions)
    .pipe(catchError(this.handleError));
  }


  public getOneContractRequest(id:number){
    const url = this.common.makeUrl("/request/get_detail_request");
    return this.httpClient
    .post<any>(url,id,this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  public addOneRequest(req:Request){
    const url = this.common.makeUrl("/request/add_one_request");
    return this.httpClient
    .post<any>(url,req,this.httpOptions)
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
