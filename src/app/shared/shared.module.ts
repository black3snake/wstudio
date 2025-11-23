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
import { CommentCardComponent } from './components/comment-card/comment-card.component';
import { PopupCardComponent } from './components/popup-card/popup-card.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { PopupRingCardComponent } from './components/popup-ring-card/popup-ring-card.component';
import {MatDialogModule} from "@angular/material/dialog";
import {NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask, provideNgxMask} from "ngx-mask";
import {SpinnerComponent} from './components/spiner/spinner.component';

@NgModule({
  declarations: [
    SaveHtmlPipe,
    ServiceCardComponent,
    CleanCurrencyPipe,
    ArticleCardComponent,
    ReviewCardComponent,
    StrLimiterPipe,
    RtfViewerComponent,
    CommentCardComponent,
    PopupCardComponent,
    PopupRingCardComponent,
    SpinnerComponent,
  ],
    imports: [
        CommonModule,
        RouterLink,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        NgxMaskDirective,
        NgxMaskPipe
    ],
  exports: [
    SaveHtmlPipe,
    StrLimiterPipe,
    ServiceCardComponent,
    ArticleCardComponent,
    ReviewCardComponent,
    RtfViewerComponent,
    CommentCardComponent,
    SpinnerComponent,
  ],
  providers: [provideEnvironmentNgxMask()]
})
export class SharedModule { }
