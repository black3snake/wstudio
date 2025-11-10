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
import {AppliedFilterType} from "../../../../types/applied-filter.type";

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
  appliedFilters: AppliedFilterType[] = [];

  ngOnInit(): void {
    this.categoryService.getCategories()
      .subscribe(data => {
        this.categories = data;
      })

    this.activatedRoute.queryParams
      .pipe(
        debounceTime(500),
      )
      .subscribe((params) => {
        this.activeParams = ActiveParamsUtil.processParams(params);

        this.emptyArticlesInCatalog = false;
        this.appliedFilters = [];

        if (this.activeParams.categories) {
          this.activeParams.categories.forEach(category => {
            this.appliedFilters.push({
                name: this.associationCategoryUrlName(category),
                urlParam: category,
              }
            )
          })
        }
        console.log('appliedFilters');
        console.log(this.appliedFilters)

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

  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    if (this.activeParams.categories) {
      this.activeParams.categories = this.activeParams.categories.filter(item => item !== appliedFilter.urlParam);
    }
    this.activeParams.page = 1;
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    });
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

      if (this.activeParams.categories.includes(category.url)) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== category.url);
      } else {
        // this.activeParams.categories.push(category.url); // работает с косяками
        this.activeParams.categories = [...this.activeParams.categories, category.url];
      }
    }
    this.activeParams.page = 1;
    console.log('activeParams');
    console.log(this.activeParams);
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    });
  }

  getEnableFilter(categoryUrl: string): boolean {
    if (this.activeParams.categories) {
      return this.activeParams.categories.includes(categoryUrl);
    } else {
      return false;
    }
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    });
  }
  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams
      });
    }
  }
  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams
      });
    }
  }



}
