import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, mergeMap, take } from 'rxjs/operators';
import { Product } from 'src/app/models/product';
import { ProductService } from '../product.service';
import { ShareDataService } from '../share-data.service';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailResolverService implements Resolve<Product> {

  constructor(
    private router: Router,
    private productService: ProductService,
    private shareDataService: ShareDataService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> | Observable<never> {
    this.shareDataService.stateRequestSource.next('W');
    const productId = route.paramMap.get('id') ? route.paramMap.get('id')! : "";
    // route.fragment
    //   .pipe(map(fragment => fragment || 'None'));
    if (productId === "") {
      this.router.navigate(['']);
      return EMPTY;
    }
    return this.productService.getProductDetail(productId)
      .pipe(
        delay(0),
        take(1),
        mergeMap(
          data => {
            if(data === null) {
              console.error('Not found Product!');
              this.router.navigate(['']);
              return EMPTY;
            } else {
              return of(data);
            }
          }
        ),
        catchError(err => {
          console.error(err);
          this.router.navigate(['']);
          return EMPTY;
        })
      );
  }

}
