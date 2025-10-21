import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaveHtmlPipe } from './pipes/save-html.pipe';
import { ServiceCardComponent } from './components/service-card/service-card.component';
import {RouterLink} from "@angular/router";
import { CleanCurrencyPipe } from './pipes/clean-currency.pipe';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { ReviewCardComponent } from './components/review-card/review-card.component';

@NgModule({
  declarations: [
    SaveHtmlPipe,
    ServiceCardComponent,
    CleanCurrencyPipe,
    ArticleCardComponent,
    ReviewCardComponent,
  ],
  imports: [
    CommonModule,
    RouterLink,
  ],
  exports: [
    SaveHtmlPipe,
    ServiceCardComponent,
    ArticleCardComponent,
    ReviewCardComponent,
  ]
})
export class SharedModule { }
