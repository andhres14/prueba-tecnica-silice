import { Component, inject, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { NgIf, DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '@features/product/services/products.service';
import { Product } from '@features/product/models/product.model';
import { SnackBarService } from '@shared/services/snack-bar.service';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    RouterLink,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  productId: number = 0;
  product?: Product;
  private readonly productService = inject(ProductsService);
  private route = inject(ActivatedRoute);
  router = inject(Router);
  private snackBarService = inject(SnackBarService);
  loading: boolean = false;

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.getProductInformation();
  }

  getProductInformation(): void {
    this.loading = true;
    this.productService.getProduct(this.productId)
      .subscribe(product => {
        this.loading = false;
        if (!product) {
          this.snackBarService.showSnackBar('El Producto no existe!', 'error');
          this.router.navigate(['/products']);
          return;
        }
        this.product = product;
      });
  }

}
