import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product';
import { Utility } from 'src/app/utilities/utility';
declare var $: any;

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  animations: [
    trigger('hideShow', [
      state('hide', style({ opacity: '0.3' })),
      state('show', style({ opacity: '1' })),
      transition('hide <=> show', [
        animate(100)
      ]),
    ])
  ]
})
export class ProductListComponent implements OnInit {

  categoryId: string = "";
  nProductCount: number = 0;
  nProductOfPage: number = 0;
  nPage: number = 0;
  products: Product[] = [];
  isShow: boolean = false;
  paginations: string[] = [];
  indexPage: number = 0;
  nPageCount: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.route.data.subscribe(
      data => {
        this.isShow = false;
        setTimeout(() => {
          let obj = data.obj;
          this.nProductOfPage = obj.paramas.nProductOfPage;
          this.nPage = obj.paramas.nPage;
          this.categoryId = obj.paramas.categoryId;
          this.products = obj.products;
          this.nProductCount = obj.count;
          this.nPageCount = Math.floor(this.nProductCount / this.nProductOfPage);
          this.nPageCount = (this.nProductCount % this.nProductOfPage) === 0 ? this.nPageCount : this.nPageCount + 1;
          this.paginations = Utility.pagination(this.nPage, this.nPageCount);
          this.indexPage = this.getIndexPage();
          this.isShow = true;
        }, 100);
      }
    )

    $("select").niceSelect();

  }

  private getIndexPage(): number {
    let result = 0;
    for (let i = 0; i < this.paginations.length; i++) {
      if (`${this.nPage}` === this.paginations[i]) {
        result = i;
        break;
      }
    }
    return result;
  }

  addOrSubPage(isAdd: boolean) {
    if (isAdd && this.nPage < this.nPageCount) {
      this.router.navigate(['/product-list', { id: this.categoryId, page: this.nPage + 1 }]);
    } else if (!isAdd && this.nPage > 1) {
      this.router.navigate(['/product-list', { id: this.categoryId, page: this.nPage - 1 }]);
    }
  }

  onSelectPage(i: number) {
    let nPageSelect = parseInt(this.paginations[i]);
    if (nPageSelect) {
      if (this.categoryId !== "") {
        this.router.navigate(['/product-list', { id: this.categoryId, page: nPageSelect }]);
      } else {
        this.router.navigate(['/product-list', { page: nPageSelect }]);
      }
    }
  }

  onSelectSort(field: string, sort: number) {
    if (this.categoryId !== "") {
      this.router.navigate(['/product-list', { id: this.categoryId, page: this.nPage, field: field, sort: sort }]);
    } else {
      this.router.navigate(['/product-list', { page: this.nPage, field: field, sort: sort }]);
    }
  }

}
