import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private _getUrl = `${environment.apiUrl}/product`;
  private _getNumberPageUrl = `${environment.apiUrl}/product-count`;
  private _getProductDetailUrl = `${environment.apiUrl}/product-detail`;

  constructor(private http: HttpClient) { }

  getProducts(categoryId: string, nLimit: number, nPage: number, fieldSort: string, sortType: number): Observable<any> {
    var apiURL = this._getUrl + `?categoryId=${categoryId}&nLimit=${nLimit}&nPage=${nPage}&fieldSort=${fieldSort}&sortType=${sortType}`;
    return this.http.get<any>(apiURL);
  }
  
  getProductDetail(productId: string): Observable<Product> {
    var apiURL = this._getProductDetailUrl + `?productId=${productId}`;
    return this.http.get<Product>(apiURL);
  }
}
