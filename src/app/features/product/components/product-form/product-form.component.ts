import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '@features/product/services/products.service';
import { Product } from '@features/product/models/product.model';
import { NgIf } from '@angular/common';
import { SnackBarService } from '@shared/services/snack-bar.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressBarModule,
    RouterLink
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  _id: number = 0;
  product?: Product;
  isCreationMode: boolean = true;
  formProduct!: FormGroup;
  sending: boolean = false;
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductsService,
    private snackBarService: SnackBarService
  ) {
    this.formProduct = this.fb.group({
      name: ['', [ Validators.required, Validators.minLength(3) ]],
      description: [''],
      price: ['', [Validators.required, Validators.min(1)]]
    })
  }

  ngOnInit(): void {
    this._id = Number(this.route.snapshot.paramMap.get('id'));
    this.isCreationMode = (this._id === 0);
    if (!this.isCreationMode) {
      this.getProductInformation();
    }
  }

  onSubmit() {
    if (!this.formProduct.valid) return;

    this.sending = true;
    const product: Product = {
      id: this.productId,
      ...this.formProduct.value,
      createdAt: this.isCreationMode ? new Date() : this.product?.createdAt,
      updatedAt: new Date()
    }

    if (this.isCreationMode) {
      this.productService.addProduct(product)
        .subscribe(() => {
          this.sending = false;
          this.snackBarService.showSnackBar('Producto agregado correctamente!', 'ok');
          this.router.navigate(['/products']);
        });
    } else {
      this.productService.updateProduct(product)
        .subscribe(() => {
          this.formProduct.markAsPristine();
          this.formProduct.markAsUntouched();
          //this.sending = false;
          this.snackBarService.showSnackBar('Información actualizada correctamente!', 'ok');
          this.router.navigate(['/products', this._id, 'detail']);
        });
    }
  }

  getProductInformation(): void {
    this.loading = true;
    this.productService.getProduct(this._id)
      .subscribe(product => {
        this.loading = false;
        if (!product) {
          this.snackBarService.showSnackBar('El Producto no existe!', 'error');
          this.router.navigate(['/products']);
          return;
        }
        this.product = product;
        this.setProductFormData(product);
      });
  }

  setProductFormData(product: Product): void {
    this.formProduct.controls['name'].setValue(product.name);
    this.formProduct.controls['description'].setValue(product.description);
    this.formProduct.controls['price'].setValue(product.price);
  }

  get productId(): number {
    return this._id === 0 ? (Math.floor(Math.random() * 10000) + 1) : this._id;
  }

  isDirty(): boolean {
    return this.formProduct.dirty;
  }
}
