import {Component, inject, Input, OnInit} from '@angular/core';
import {CommentsType} from "../../../../types/comments-count.type";
import {CommentService} from "../../services/comment.service";
import {ArticleDetailType} from "../../../../types/article-detail.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CommentActionType, userCommentActions} from "../../../../types/comment-action.type";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {catchError, of} from "rxjs";

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements OnInit {
  @Input() comment!: CommentsType;
  liked = false;
  disliked = false;
  violate = false;
  private like = 1;
  private dislike = 1;

  private commentsService = inject(CommentService);
  private authService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);

  constructor() {

  }
  ngOnInit(): void {
    // this.commentsService.getActionComment(this.comment.id)
    //   .subscribe({
    //     next: (data: CommentActionType[] | DefaultResponseType) => {
    //       if ((data as DefaultResponseType).error !== undefined) {
    //         const error = (data as DefaultResponseType).message;
    //         throw new Error(error);
    //       }
    //       this.handleCommentAction(data as CommentActionType[]);
    //     },
    //     error: (err: HttpErrorResponse) => {
    //       if (err.error && err.error.message) {
    //         console.log(err.error.message)
    //       } else {
    //         console.log('Ошибка ответа от сервера')
    //       }
    //     }
    //   })

    this.handleCommentAction2();
  }

  handleCommentAction2() {
    if (this.comment && this.comment.reactionAction) {
      switch (this.comment.reactionAction) {
        case userCommentActions.like:
          this.liked = true;
          this.like = 0;
          this.dislike = 1;
          this.disliked = false;
          // console.log("Лайк комментария:", this.comment.reactionAction);
          break;
        case userCommentActions.dislike:
          this.disliked = true;
          this.like = 1;
          this.dislike = 0;
          this.liked = false;
          // console.log("Дизлайк комментария:", this.comment.reactionAction);
          break;
      }
    }
  }

  // handleCommentAction(actionData: CommentActionType[]): void {
  //   for (let aData of actionData) {
  //     switch (aData.action) {
  //       case userCommentActions.like:
  //         this.liked = true;
  //         this.like = 0;
  //         this.dislike = 1;
  //         this.disliked = false;
  //         // console.log("Лайк комментария:", aData.comment);
  //         break;
  //       case userCommentActions.dislike:
  //         this.disliked = true;
  //         this.like = 1;
  //         this.dislike = 0;
  //         this.liked = false;
  //         // console.log("Дизлайк комментария:", aData.comment);
  //         break;
  //       case userCommentActions.violate:
  //         this.violate = true;
  //         // console.log("Жалоба на комментарий:", aData.comment);
  //         break;
  //     }
  //   }
  // }

  updateAction(actionType: 'like' | 'dislike'): void {
    if (!this.authService.getIsLoggedIn()) {
      this._snackBar.open('Для добавление реакции на комментарий необходимо авторизоваться');
      return;
    }

    // const canPerformAction = (actionType === 'like') ? this.like === 1 : this.dislike === 1;
    // if (!canPerformAction) {
    //   return;
    // }

    const serverAction = actionType === 'like' ? userCommentActions.like : userCommentActions.dislike;

    this.commentsService.updateActionComment(this.comment.id, {action: serverAction})
      .subscribe({
        next: data => {
          if (data.error) {
            throw new Error(data.message);
          }

          if (actionType === userCommentActions.like) {
            if (!this.liked) {
              this.liked = true;
              this.comment.likesCount += this.like;
              this.like = 0;
              this._snackBar.open('Ваш голос учтен');

              if (this.disliked) {
                this.disliked = false;
                if (this.comment.dislikesCount > 0) {
                  this.comment.dislikesCount -= 1;
                  this.dislike = 1;
                }
              }
            } else {
              this.liked = false;
              this.comment.likesCount -= 1;
              this.like = 1;
            }

          } else {
            if (!this.disliked) {
              this.disliked = true;
              this.comment.dislikesCount += this.dislike;
              this.dislike = 0;
              this._snackBar.open('Ваш голос учтен');

              if (this.liked) {
                this.liked = false;
                if (this.comment.likesCount > 0) {
                  this.comment.likesCount -= 1;
                  this.like = 1;
                }
              }
            } else {
              this.disliked = false;
              this.comment.dislikesCount -= 1;
              this.dislike = 1;
            }
          }
        },
        error: (err: HttpErrorResponse) => {
          if (err.error && err.error.message) {
            console.log(err.error.message);
          } else {
            console.log('Не могу получить доступ к серверу');
          }
        }
      });

  }

  updateActionViolate(actionType: 'violate'): void {
    if (!this.authService.getIsLoggedIn()) {
      this._snackBar.open('Для добавление реакции на комментарий необходимо авторизоваться');
      return;
    }

    this.commentsService.updateActionComment(this.comment.id, {action: actionType})
      .subscribe({
        next: data => {
          if (data && data.error) {
            this._snackBar.open(data.message);
          } else {
            this._snackBar.open('Жалоба на комментарий отправлена')
          }
        },
        error: (err: HttpErrorResponse) => {
            const message = err.error?.message || 'Не могу получить доступ к серверу';
            this._snackBar.open(message);
        }
      });

  }
}
