import { Route } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';

import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError, map, mergeMap, take } from 'rxjs/operators';
import { Product } from 'src/app/models/product';

import { ProductService } from '../product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductListResolverService implements Resolve<any> {

  constructor(
    private router: Router,
    private productService: ProductService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Observable<never> {
    const categoryId = route.paramMap.get('id') ? route.paramMap.get('id')! : "";
    const nPage = route.paramMap.get('page') ? parseInt(route.paramMap.get('page')!, 10) : 1;
    const fieldSort = route.paramMap.get('field') ? route.paramMap.get('field')! : "";
    const sortType = route.paramMap.get('sort') ? parseInt(route.paramMap.get('sort')!, 10) : 1;
    return this.productService.getProducts(categoryId, 16, nPage, fieldSort, sortType)
      .pipe(
        take(1),
        mergeMap(data => {
          if (data.existCategory) {
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
