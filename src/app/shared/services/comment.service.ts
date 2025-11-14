import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";
import {CommentsCountType, CommentsType} from "../../../types/comments-count.type";
import {CommentsParamsType} from "../../../types/comments-params.type";
import {CommentParamsType} from "../../../types/comment-params.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private http = inject(HttpClient);
  private commentsSubject = new BehaviorSubject<{comments: CommentsType[], isNewLoad: boolean} | null>(null);
  public comments$ = this.commentsSubject.asObservable();


  getComments(params: CommentsParamsType): Observable<CommentsCountType | DefaultResponseType> {
    return this.http.get<CommentsCountType | DefaultResponseType>(environment.apiUrl + 'comments', {
      params: {
        ...params,
        limit: 10
      }
    });
  }

  createComment(params: CommentParamsType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.apiUrl + 'comments', params)    // ,{withCredentials: true});
      .pipe(
        tap((response) => {
          if (!response.error) {
            this.refreshComments({
              article: params.article,
              offset: 0
            }, true); // true - новая загрузка комментов
          }
        })
      )
  }

  refreshComments(params: CommentsParamsType, isNewLoad: boolean) : void {
    this.getComments(params)
      .subscribe(comments => {
        if((comments as DefaultResponseType).error === undefined) {
          this.commentsSubject.next( {
            comments: (comments as CommentsCountType).comments,
            isNewLoad: isNewLoad
          });
        }
      })
  }

  // Загрузка след 10 комментов
  loadMoreComments(articleId: string, currentOffset: number): void {
    this.refreshComments({
      article: articleId,
      offset: currentOffset
    }, false);
  }

}
