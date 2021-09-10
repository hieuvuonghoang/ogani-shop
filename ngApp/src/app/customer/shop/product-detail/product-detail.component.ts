import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BreadCrumb } from 'src/app/models/bread-crumb';
import { Image } from 'src/app/models/image';
import { Product } from 'src/app/models/product';
import { Url } from 'src/app/models/url';
import { ShareDataService } from 'src/app/services/share-data.service';

declare var $: any;

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit, AfterViewInit {

  image!: Image;
  product!: Product;
  quantity: number = 1;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private shareDataService: ShareDataService,
  ) { }

  ngOnInit(): void {
    
    this.route.data.subscribe(
      data => {
        this.product = data.obj;
        this.image = this.product.images[0];
        window.scroll(0, $("#bread-crumb-begin").offset().top);
      }
    )

    this.shareDataService.breadcrumbSource.next(this.initBreadCrumb());

  }

  ngAfterViewInit(): void {
    $(".product__details__pic__slider").owlCarousel({
      loop: true,
      margin: 20,
      items: 4,
      dots: true,
      smartSpeed: 1200,
      autoHeight: false,
      autoplay: true
    });
  }

  onSelectImage(id: string) {
    // const navigationExtras: NavigationExtras = {
    //   queryParams: {id: this.product._id},
    //   fragment: 'product-detail-header'
    // };
    this.image = this.product.images.find(image => image._id === id)!;
    // this.router.navigate(['/product-detail', navigationExtras]);
  }

  private initBreadCrumb() {
    let breadCrumb = new BreadCrumb();
    breadCrumb.name = this.product.name;
    breadCrumb.urls.push(new Url("/home", "Home"));
    breadCrumb.urls.push(new Url(`/product-list/${this.product.category?._id}`, this.product.category?.name!));
    breadCrumb.urls.push(new Url('', this.product.name));
    return breadCrumb;
  }

}
