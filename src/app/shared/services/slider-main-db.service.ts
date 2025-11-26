import { Injectable } from '@angular/core';
import {SliderMainType} from "../../../types/slider-main.type";

@Injectable({
  providedIn: 'root'
})
export class SliderMainDbService {

  constructor() { }

  getSliderMain(): SliderMainType[] {
    return [
      {
        "id": 1,
        "article": "Предложение месяца",
        "title": "Продвижение в Instagram для вашего бизнеса <span>-15%</span>!",
        "description": "",
        "image": "banner1.png",
        "url": "/",
        service: "Продвижение",
      },
      {
        "id": 2,
        "article": "Акция",
        "title": "Нужен грамотный <span>копирайтер</span>?",
        "description": "Весь декабрь у нас действует акция на работу копирайтера.",
        "image": "banner2.png",
        "url": "/",
        service: "Копирайтинг",
      },
      {
        "id": 3,
        "article": "Новость дня",
        "title": "<span>6 место</span> в ТОП-10 SMM-агенств Москвы!",
        "description": "Мы благодарим каждого, кто голосовал за нас!",
        "image": "banner3.png",
        "url": "/",
        service: "Реклама",
      },
    ]
  }
}
