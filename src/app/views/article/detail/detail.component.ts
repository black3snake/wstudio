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
import {CommentsParamsType} from "../../../../types/comments-params.type";
import {CommentsCountType, CommentsType} from "../../../../types/comments-count.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentParamsType} from "../../../../types/comment-params.type";
import {ArticleDetailType} from "../../../../types/article-detail.type";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  article!: ArticleDetailType;
  articlesRel: ArticleType[] = [];


  commentsArticle!: CommentsCountType;
  isLogged: boolean = false;
  commentsCount: number = 1;
  paramCommentsObject: CommentsParamsType = {
    offset: 3,
    article: '',
  }

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
            this.commentsArticle = {
              allCount: this.article.commentsCount,
              comments: this.article.comments
            };
            console.log(this.commentsArticle);

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
            this.router.navigate(['/comments/' + this.article.url]);
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

  moreComments() {
    this.paramCommentsObject.article = this.article.id;
    this.commentsService.getComments(this.paramCommentsObject)
      .subscribe((dataComments: CommentsCountType | DefaultResponseType) => {
        if ((dataComments as DefaultResponseType).error !== undefined) {
          const error = (dataComments as DefaultResponseType).message;
          throw new Error(error);
        }
        // this.comments = dataComments as CommentsType;
        // console.log(this.comments);
      })
  }

}
