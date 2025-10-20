import {Component, Input} from '@angular/core';
import {ServiceCardType} from "../../../../types/service-card.type";

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss']
})
export class ServiceCardComponent {
  @Input() serviceM!: ServiceCardType;

}
