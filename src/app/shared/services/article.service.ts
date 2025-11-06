import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ArticleType} from "../../../types/article.type";
import {environment} from "../../../environments/environment";
import {ActiveParamsType} from "../../../types/active-params.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private http = inject(HttpClient);

  getTopArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.apiUrl + 'articles/top');
  }

  getArticles(params: ActiveParamsType): Observable<{totalCount: number, pages: number, items: ArticleType[]}> {
    return this.http.get<{totalCount: number, pages: number, items: ArticleType[]}>(environment.apiUrl + 'articles', {
      params: params
    });
  }

  getArticle(url: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.apiUrl + 'articles' + url);
  }

  getArticleRelated(url: string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.apiUrl + 'articles/related' + url);
  }

}
