import {ArticleCardComponent} from "./article-card.component";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import { NO_ERRORS_SCHEMA} from "@angular/core";
import {Router} from "@angular/router";
import {ArticleType} from "../../../../types/article.type";

describe('ArticleCardComponent', () => {
  let component: ArticleCardComponent;
  let fixture: ComponentFixture<ArticleCardComponent>;
  let article: ArticleType;

  beforeEach( () => {
    const routerSpy = jasmine.createSpyObj("Router", ['navigate']);

    TestBed.configureTestingModule({
      declarations: [ArticleCardComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {provide: Router, useValue: routerSpy},
      ]
    });

    fixture = TestBed.createComponent(ArticleCardComponent);
    component = fixture.componentInstance;
    article = {
      id: "01df",
          title: "Test Article 1",
          description: "Test Description 1",
          image: "test1.jpg",
          date: "2024-01-01",
          category: "tech",
          url: "test-url-1"
    }
    component.article = article;
  });

  it('should testing field count', () => {
    console.log(component)
    expect(component.count).toBe(1)
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy()
  });
});
