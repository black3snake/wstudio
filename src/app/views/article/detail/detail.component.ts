import {Component, inject, OnInit} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {ArticleService} from "../../../shared/services/article.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../../core/auth/auth.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FormBuilder, Validators} from "@angular/forms";
import {CommentService} from "../../../shared/services/comment.service";
import {CommentsType} from "../../../../types/comments-count.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentParamsType} from "../../../../types/comment-params.type";
import {ArticleDetailType} from "../../../../types/article-detail.type";
import {CommentActionType} from "../../../../types/comment-action.type";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  article!: ArticleDetailType;
  articlesRel: ArticleType[] = [];

  allComments: CommentsType[] = [];
  allActionsArticleOfUsers: CommentActionType[] = []
  isLogged: boolean = false;

  currentOffset = 3;
  hasMoreComments = false;
  isLoadingMore = false;
  totalCommentsCount = 0;

  private articleService = inject(ArticleService);
  private activatedRoute = inject(ActivatedRoute)
  private router = inject(Router);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private commentsService = inject(CommentService);
  private _snackBar = inject(MatSnackBar);

  commentForm = this.fb.group({
    text: ['', [Validators.required, Validators.pattern(/^(?=.{20,}$)[а-яёА-ЯЁa-zA-Z0-9,.:;"'!?\-\s]+$/)]],
  })

  get text() {
    return this.commentForm.get('text');
  }

  constructor() {
    this.authService.isLogged$
      .pipe(takeUntilDestroyed())
      .subscribe((isLogged: boolean) => {
        this.isLogged = isLogged;
      })

    this.commentsService.comments$
      .pipe(takeUntilDestroyed())
      .subscribe((commentsData: { comments: CommentsType[], isNewLoad: boolean } | null) => {
        this.isLoadingMore = false;

        if (commentsData) {
          if (commentsData.isNewLoad) {
            // Новая загрузка (после добавления комментария) - заменяем все комментарии
            this.allComments = this.updateAllComments(commentsData.comments);
            this.currentOffset = commentsData.comments.length;
          } else {
            // добавляем к существующим
            this.allComments = [...this.allComments, ...this.updateAllComments(commentsData.comments)];
            this.currentOffset += commentsData.comments.length;
          }

          this.updateHasMoreComments();
        }
      });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe({
          next: (data: ArticleDetailType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              const error = (data as DefaultResponseType).message;
              throw new Error(error);
            }

            this.article = data as ArticleDetailType;
            this.totalCommentsCount = this.article.commentsCount;

            const allCommentsPrev: CommentsType[] = this.article.comments || [];

            if (this.isLogged) {
              this.commentsService.getActionCommentUserForArticle({articleId: this.article.id})
                .subscribe({
                  next: dataAction => {
                    if ((dataAction as DefaultResponseType).error !== undefined) {
                      throw new Error((dataAction as DefaultResponseType).message);
                    }
                    this.allActionsArticleOfUsers = dataAction as CommentActionType[];
                    // console.log(this.allActionsArticleOfUser)
                  }
                })
            }
            this.allComments = this.updateAllComments(allCommentsPrev);
            // console.log(this.allComments)
            this.updateHasMoreComments();

            this.articleService.getArticleRelated(this.article.url)
              .subscribe((dataRel: ArticleType[] | DefaultResponseType) => {
                  if ((dataRel as DefaultResponseType).error !== undefined) {
                    const error = (dataRel as DefaultResponseType).message;
                    throw new Error(error);
                  }
                  this.articlesRel = dataRel as ArticleType[];
                }
              )

          },
          error: (err: HttpErrorResponse) => {
            if (err.error && err.error.message) {
              this._snackBar.open(err.error.message);
            } else {
              this._snackBar.open('Ошибка ответа от сервера')
            }
          }

        })
    })

  }

  submit() {
    if (this.commentForm.valid && this.commentForm.value.text) {
      const paramCommentObject: CommentParamsType = {
        text: this.commentForm.value.text,
        article: this.article.id,
      }
      this.commentsService.createComment(paramCommentObject)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error) {
              throw new Error(data.message)
            }
            this.commentForm.reset();
            this._snackBar.open('Комментарий добавлен');
            this.totalCommentsCount += 1;
          },
          error: (err: HttpErrorResponse) => {
            if (err.error && err.error.message) {
              this._snackBar.open(err.error.message);
              console.log(err.error.message);
            } else {
              this._snackBar.open('Ошибка добавление комментария');
            }
          }
        })
    }
  }

  loadMoreComments(): void {
    if (this.hasMoreComments && this.article && !this.isLoadingMore) {
      this.isLoadingMore = true;
      this.commentsService.loadMoreComments(this.article.id, this.currentOffset);
    }
    // console.log('this.isLoadingMore: ' + this.isLoadingMore)
  }

  private updateHasMoreComments() {
    this.hasMoreComments = this.allComments.length < this.totalCommentsCount;
  }

  private updateAllComments(allCommentsPrev: CommentsType[]) {
    let allComments: CommentsType[];
    allComments = allCommentsPrev.map(comment => {
      const foundId = this.allActionsArticleOfUsers.find(item => item.comment == comment.id)
      if (foundId) {
        comment.reactionAction = foundId.action;
      }
      return comment;
    })
    return allComments;
  }
}
