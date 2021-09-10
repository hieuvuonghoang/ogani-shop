import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from 'src/app/animations/animations';
import { BreadCrumb } from 'src/app/models/bread-crumb';
import { Url } from 'src/app/models/url';
import { ShareDataService } from 'src/app/services/share-data.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
  animations: [
    slideInAnimation,
    trigger('routeAnimations', []),
    trigger('hideShow', [
      state('hide', style({ opacity: '0.2' })),
      state('show', style({ opacity: '1' })),
      transition('hide <=> show', [
        animate(500)
      ]),
    ])
  ],
})
export class ShopComponent implements OnInit {

  isShow: boolean = false;

  constructor(
    private shareDataService: ShareDataService,
  ) { }

  ngOnInit(): void {
    // this.shareDataService.breadcrumbSource.next(this.initBreadCrumb());
    this.shareDataService.stateRequestSource.subscribe(
      data => {
        if(data === "W") {
          this.isShow = false;
        } else if(data === "C") {
          this.isShow = true;
        }
      }
    )
  }

  // private initBreadCrumb() {
  //   let breadCrumb = new BreadCrumb();
  //   breadCrumb.name = "Ogani Shop";
  //   breadCrumb.urls.push(new Url("/home", "Home"));
  //   breadCrumb.urls.push(new Url("", "Shop"));
  //   return breadCrumb;
  // }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}
