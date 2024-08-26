import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Product } from '@features/product/models/product.model';
import { ProductsService } from '@features/product/services/products.service';
import { SnackBarService } from '@shared/services/snack-bar.service';
import { Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'description', 'price', 'createdAt', 'actions'];
  dataSource!: MatTableDataSource<Product>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductsService,
    private snackBarService: SnackBarService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getProductsList();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getProductsList(): void {
    this.productService.getProducts()
      .subscribe(products => {
        this.dataSource = new MatTableDataSource(products);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
  }

  onEdit(productId: number) {
    this.router.navigateByUrl(`/products/${productId}/edit`);
  }

  onDetail(productId: number) {
    this.router.navigateByUrl(`/products/${productId}/detail`);
  }

  onDelete(productId: number) {
    if (confirm('¿Seguro que desea eliminar este producto?')) {
      this.productService.deleteProduct(productId)
        .subscribe(() => {
          this.snackBarService.showSnackBar('El producto fue eliminado con exito!', 'success');
          this.getProductsList();
        });
    }
  }

  ngAfterViewInit(): void {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  }
}
