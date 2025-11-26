import {Component, ElementRef, inject, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {SliderMainDbService} from "../../shared/services/slider-main-db.service";
import {SliderMainType} from "../../../types/slider-main.type";
import {ServiceDbService} from "../../shared/services/service-db.service";
import {ServiceCardType} from "../../../types/service-card.type";
import {ArticleType} from "../../../types/article.type";
import {ArticleService} from "../../shared/services/article.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ReviewService} from "../../shared/services/review.service";
import {ReviewCardType} from "../../../types/review-card.type";
import {Router} from "@angular/router";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {take} from "rxjs";
import {PopupCardComponent} from "../../shared/components/popup-card/popup-card.component";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  customOptionsMain: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['',''],
    dotsEach: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
    },
    nav: false,
  }
  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 25,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
    },
    nav: false,
  }
  topSliders: SliderMainType[] = [];
  servicesMain: ServiceCardType[] = [];
  articles: ArticleType[] = [];
  reviews: ReviewCardType[] = [];
  dialogRef: MatDialogRef<any> | null = null;

  private slidersMain = inject(SliderMainDbService);
  private servicesDbServices = inject(ServiceDbService);
  private articleService = inject(ArticleService);
  private reviewService = inject(ReviewService);
  private router = inject(Router);
  private dialog = inject(MatDialog);


  ngOnInit(): void {
    this.topSliders = this.slidersMain.getSliderMain();
    this.servicesMain = this.servicesDbServices.getServicesMain();
    this.reviews = this.reviewService.getReviews();

    this.articleService.getTopArticles()
      .subscribe({
        next: (data: ArticleType[] ) => {
          this.articles = data;
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        }
      })
  }

  moreDetails(service: string) {
    this.dialogRef = this.dialog.open(PopupCardComponent, {
      data: {
        service: service,
      },
    });

    this.dialogRef.afterOpened()
      .pipe(take(1))
      .subscribe(() => {
        // Убираем aria-hidden с app-root после открытия диалога
        const appRoot = document.querySelector('app-root');
        if (appRoot) {
          appRoot.removeAttribute('aria-hidden');
        }
      });

    this.dialogRef.backdropClick()
      .subscribe(() => {
        this.dialogRef?.close();
        this.router.navigate(['/']);
      });
  }


  ngOnDestroy() {
    // this.destroy$.next();
    // this.destroy$.complete();
    // this.dialogRef?.close();
  }

}
