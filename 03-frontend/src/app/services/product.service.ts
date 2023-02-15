import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';

// injected into other classes/components
@Injectable({
  providedIn: 'root'
})


export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products'; //?size=100'; -> velkost


  constructor(private httpClient: HttpClient) { }

  // return observable Product
  getProduct(theProductId: number): Observable<Product> {

    // need to build URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    // map the JSON data from Spring Data REST to Product Array
    return this.httpClient.get<Product>(productUrl);
  }


  getProductListPaginate(thePage: number,
                         thePagesize: number,
                         theCategoryId: number): Observable<GetResponse> {

    // need to build URL based on category id, page, and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` + `&page=${thePage}&size=${thePagesize}`;

    return this.httpClient.get<GetResponse>(searchUrl);
  }

  getProductList(theCategoryId: number): Observable<Product[]> {

    // need to build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {

    // need to build URL based on keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;


    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number,
    thePagesize: number,
    theKeyword: string): Observable<GetResponse> {

      // need to build URL based on keyword, page, and size
      const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}` + `&page=${thePage}&size=${thePagesize}`;

      return this.httpClient.get<GetResponse>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    // map JSON data from Spring Data REST to Product Array
    return this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}

// unwraps the JSON from Spring Data REST and placing it into Product array
interface GetResponse {
  _embedded: {
    products: Product[];
  }
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  }
}




function theProductId(theProductId: any, number: any) {
  throw new Error('Function not implemented.');
}

