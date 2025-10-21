import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComponent } from './main.component';
import {ArticleService} from "../../shared/services/article.service";
import {of} from "rxjs";
import {ArticleCardComponent} from "../../shared/components/article-card/article-card.component";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let mockArticleService: jasmine.SpyObj<ArticleService>;

  beforeEach(async () => {
    // Создаем mock сервиса
    mockArticleService = jasmine.createSpyObj('ArticleService', ['getTopArticles']);

    // Настраиваем возвращаемые данные
    mockArticleService.getTopArticles.and.returnValue(of([
      {
        id: "01df",
        title: "Test Article 1",
        description: "Test Description 1",
        image: "test1.jpg",
        date: "2024-01-01",
        category: "tech",
        url: "test-url-1"
      },
      {
        id: "02ab",
        title: "Test Article 2",
        description: "Test Description 2",
        image: "test2.jpg",
        date: "2024-01-02",
        category: "design",
        url: "test-url-2"
      }
    ]));

    await TestBed.configureTestingModule({
      declarations: [MainComponent, ArticleCardComponent],
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ArticleService, useValue: mockArticleService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load articles on init', () => {
    expect(mockArticleService.getTopArticles).toHaveBeenCalled();
    expect(component.articles.length).toBe(2);
  });

  it('should display article cards', () => {
    const compiled = fixture.nativeElement;
    const articleCards = compiled.querySelectorAll('app-article-card');
    expect(articleCards.length).toBe(2);
  });
});
