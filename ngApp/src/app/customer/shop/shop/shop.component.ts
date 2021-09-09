import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from 'src/app/animations/animations';
import { BreadCrumb } from 'src/app/models/bread-crumb';
import { Url } from 'src/app/models/url';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
  animations: [ slideInAnimation ],
})
export class ShopComponent implements OnInit {

  constructor(
    private shareData: ShareDataService,
  ) { }

  ngOnInit(): void {
    this.shareData.breadcrumbSource.next(this.initBreadCrumb());
  }

  private initBreadCrumb() {
    let breadCrumb = new BreadCrumb();
    breadCrumb.name = "Ogani Shop";
    breadCrumb.urls.push(new Url("/home", "Home"));
    breadCrumb.urls.push(new Url("", "Shop"));
    return breadCrumb;
  }

  prepareRoute(outlet: RouterOutlet) {
    console.log('OK');
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}
