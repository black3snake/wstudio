import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleType} from "../../../../types/article.type";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CategoryService} from "../../../shared/services/category.service";
import {CategoryType} from "../../../../types/category.type";
import {debounceTime} from "rxjs";
import {ActiveParamsUtil} from "../../../shared/util/active-params.util";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  private router = inject(Router);
  private articleService = inject(ArticleService);
  private _snackBar = inject(MatSnackBar);
  private categoryService = inject(CategoryService);
  private activatedRoute = inject(ActivatedRoute)

  open: boolean = false;
  enableFilter: boolean = false;
  emptyArticlesInCatalog: boolean = false;
  articles: ArticleType[] = [];
  activeParams: ActiveParamsType = {categories: []};
  categories: CategoryType[] = [];
  pages: number[] = [];

  ngOnInit(): void {
    this.categoryService.getCategories()
      .subscribe(data => {
        this.categories = data;
      })

    this.activatedRoute.queryParams
      .pipe(
        debounceTime(400),
      )
      .subscribe((params) => {
        this.activeParams = ActiveParamsUtil.processParams(params);

        this.emptyArticlesInCatalog = false;


        this.articleService.getArticles(this.activeParams)
          .subscribe({
            next: (data: { totalCount: number, pages: number, items: ArticleType[] }) => {
              this.articles = data.items;

              this.pages = [];
              for (let i = 1; i <= data.pages; i++) {
                this.pages.push(i);
              }

              if (this.articles.length === 0) {
                this.emptyArticlesInCatalog = true;
              }
            },
            error: (err: HttpErrorResponse) => {
              if (err.error && err.error.message) {
                this._snackBar.open(err.error.message);
              } else {
                this._snackBar.open('Ошибка ответа от сервера при запросе статей')
              }
            }
          })

      });
  }

  processCatalog() {

  }


  associationCategoryNameUrl(name: string) {
    let nameAsUrl = '';
    for (const cat of this.categories) {
      if (cat.name === name) {
        nameAsUrl = cat.url;
        break;
      }
    }
    return nameAsUrl
  }
  associationCategoryUrlName(url: string) {
    let urlAsName = '';
    for (const cat of this.categories) {
      if (cat.url === url) {
        urlAsName = cat.name;
        break;
      }
    }
    return urlAsName
  }

  removeAppliedFilter(categoryName: string) {
    if (this.activeParams.categories && this.activeParams.urls) {
      this.activeParams.categories = this.activeParams.categories.filter(item => item !== categoryName);
      this.activeParams.urls = this.activeParams.urls.filter(item => item !== this.associationCategoryNameUrl(categoryName));
    }
  }

  toggle() {
    this.open = !this.open;
  }

  toggleFilter() {
    this.enableFilter = !this.enableFilter;
  }

  sort(category: CategoryType) {
    if (category) {
      if (!this.activeParams.categories) {
        this.activeParams.categories = [];
      }
      if (!this.activeParams.urls) {
        this.activeParams.urls = [];
      }

      if (this.activeParams.categories.includes(category.name) && this.activeParams.urls.includes(category.url)) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== category.name);
        this.activeParams.urls = this.activeParams.urls.filter(item => item !== category.url);
      } else {
        this.activeParams.categories.push(category.name);
        this.activeParams.urls.push(category.url);
      }
    }
    // console.log(this.activeParams.categories);
    // console.log(this.activeParams.urls);
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    });
  }

  getEnableFilter(categoryName: string): boolean {
    if (this.activeParams.categories) {
      return this.activeParams.categories.includes(categoryName);
    } else {
      return false;
    }
  }

}
