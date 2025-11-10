import {Component, inject, OnInit} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {ArticleService} from "../../../shared/services/article.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  article!: ArticleType;
  articlesRel: ArticleType[] = [];


  private articleService = inject(ArticleService);
  private activatedRoute = inject(ActivatedRoute)
  private router = inject(Router);

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe({
          next: (data: ArticleType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              const error = (data as DefaultResponseType).message;
              throw new Error(error);
            }
            this.article = data as ArticleType;

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
            console.log(err);
            this.router.navigate(['/404']);
          }

        })
    })

  }

}
