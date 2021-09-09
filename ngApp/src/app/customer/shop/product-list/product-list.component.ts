import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {

  nProductCount: number = 0;
  nProductOfPage: number = 16;
  products: Product[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.route.data.subscribe(
      data => {
        this.products = data.obj.products;
        this.nProductCount = data.obj.count;
      }
    )

  }

}
