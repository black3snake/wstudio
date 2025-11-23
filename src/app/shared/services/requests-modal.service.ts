import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";
import {ServiceParamsType} from "../../../types/service-params.type";

@Injectable({
  providedIn: 'root'
})
export class RequestsModalService {

  private http = inject(HttpClient);

  updateRequestForServiceOrRing(params: ServiceParamsType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.apiUrl + 'requests', params);
  }

}
