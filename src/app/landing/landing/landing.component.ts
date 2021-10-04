import {Component, OnInit} from '@angular/core';
import SwiperCore, {Navigation, Pagination} from "swiper";

SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
