import {Component, inject, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {SliderMainDbService} from "../../shared/services/slider-main-db.service";
import {SliderMainType} from "../../../types/slider-main.type";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  topSliders: SliderMainType[] = [];
  customOptionsMain: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 26,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
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
    nav: true,
  }

  slidersMain = inject(SliderMainDbService);

  ngOnInit(): void {
    this.topSliders = this.slidersMain.getSliderMain();

  }


}
