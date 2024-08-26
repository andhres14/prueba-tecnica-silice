import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { BehaviorSubject, catchError, delay, Observable, of, throwError } from 'rxjs';
import { SnackBarService } from '@shared/services/snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private snackBarService = inject(SnackBarService);
  private products$ = new BehaviorSubject<Product[]>([]);

  constructor() {
    let productsInStorage = localStorage.getItem('products');
    if (productsInStorage) {
      this.products$.next(JSON.parse(productsInStorage));
    }
  }

  getProducts() {
    return this.products$.asObservable();
  }

  getProduct(productId: number): Observable<Product | undefined> {
    return of<Product | undefined>(this.products$.getValue().find(product => product.id === productId))
      .pipe(
        delay(600),
        catchError(error => {
          console.error('Error al obtener el producto:', error);
          this.snackBarService.showSnackBar('Error al obtener el producto', 'error');
          return of(undefined);
        })
      );
  }

  addProduct(product: Product): Observable<boolean> {
    this.persistProducts([...this.products$.getValue(), product]);
    return of(true).pipe(
      delay(1000),
      catchError(error => {
        console.error('Error al agregar el producto:', error);
        this.snackBarService.showSnackBar('Error al agregar el producto', 'error');
        return throwError(() => new Error('Error al agregar el producto'));
      })
    );
  }

  updateProduct(product: Product): Observable<boolean> {
    this.persistProducts(this.products$.getValue().map(p => p.id === product.id ? product : p));
    return of(true).pipe(delay(1000));
  }

  deleteProduct(id: number): Observable<boolean> {
    this.persistProducts(this.products$.getValue().filter(product => product.id !== id));
    return of(true).pipe(delay(1000));
  }

  persistProducts(products: Product[]) {
    this.products$.next(products);
    localStorage.setItem('products', JSON.stringify(products));
  }
}
