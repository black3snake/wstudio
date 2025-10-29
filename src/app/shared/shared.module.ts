import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaveHtmlPipe } from './pipes/save-html.pipe';
import { ServiceCardComponent } from './components/service-card/service-card.component';
import {RouterLink} from "@angular/router";
import { CleanCurrencyPipe } from './pipes/clean-currency.pipe';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { ReviewCardComponent } from './components/review-card/review-card.component';
import { StrLimiterPipe } from './pipes/str-limiter.pipe';
import { RtfViewerComponent } from './components/rtf-viewer/rtf-viewer.component';

@NgModule({
  declarations: [
    SaveHtmlPipe,
    ServiceCardComponent,
    CleanCurrencyPipe,
    ArticleCardComponent,
    ReviewCardComponent,
    StrLimiterPipe,
    RtfViewerComponent,
  ],
  imports: [
    CommonModule,
    RouterLink,
  ],
  exports: [
    SaveHtmlPipe,
    StrLimiterPipe,
    ServiceCardComponent,
    ArticleCardComponent,
    ReviewCardComponent,
    RtfViewerComponent,
  ]
})
export class SharedModule { }
