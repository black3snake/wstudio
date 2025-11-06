import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CategoryType} from "../../../types/category.type";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private http = inject(HttpClient);

  getCategories(): Observable<CategoryType[]> {
    return this.http.get<CategoryType[]>(environment.apiUrl + 'categories');
  }


}
