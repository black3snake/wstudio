import {Component, inject, Input} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {Router} from "@angular/router";
import {ArticleService} from "../../services/article.service";

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {
  @Input() article!: ArticleType
  count: number = 1;

  private router = inject(Router);


}
