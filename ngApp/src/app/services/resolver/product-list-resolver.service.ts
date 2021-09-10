import { Route } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError, delay, map, mergeMap, take } from 'rxjs/operators';
import { ShareDataService } from '../share-data.service';

import { ProductService } from '../product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductListResolverService implements Resolve<any> {

  constructor(
    private router: Router,
    private productService: ProductService,
    private shareDataService: ShareDataService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Observable<never> {
    this.shareDataService.stateRequestSource.next('W');
    const categoryId = route.paramMap.get('id') ? route.paramMap.get('id')! : "";
    const nPage = route.paramMap.get('page') ? parseInt(route.paramMap.get('page')!, 10) : 1;
    const nProductOfPage = 12;
    const fieldSort = route.paramMap.get('field') ? route.paramMap.get('field')! : "";
    const sortType = route.paramMap.get('sort') ? parseInt(route.paramMap.get('sort')!, 10) : 1;
    const paramas = { categoryId: categoryId, nPage: nPage, nProductOfPage: nProductOfPage, fieldSort: fieldSort, sortType: sortType, }
    return this.productService.getProducts(categoryId, nProductOfPage, nPage, fieldSort, sortType)
      .pipe(
        delay(0),
        take(1),
        mergeMap(data => {
          if (data.existCategory) {
            data.paramas = paramas;
            this.shareDataService.stateRequestSource.next('C');
            return of(data);
          } else {
            this.router.navigate(['']);
            return EMPTY;
          }
        }),
        catchError(err => {
          console.error(err);
          this.router.navigate(['']);
          return EMPTY;
        })
      );
  }

}
