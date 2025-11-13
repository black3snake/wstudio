import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";
import {CommentsType} from "../../../types/comments.type";
import {CommentsParamsType} from "../../../types/comments-params.type";
import {CommentParamsType} from "../../../types/comment-params.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private http = inject(HttpClient);

  getComments(params: CommentsParamsType): Observable<CommentsType | DefaultResponseType> {
    return this.http.get<CommentsType | DefaultResponseType>(environment.apiUrl + 'comments', {
      params: params
    });
  }

  createComment(params: CommentParamsType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.apiUrl + 'comments', params)
      // ,{withCredentials: true});
  }



}
