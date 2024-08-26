import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ProductListComponent } from './product-list.component';

import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { ProductsService } from '@features/product/services/products.service';
import { Product } from '@features/product/models/product.model';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductsService>;
  let router: Router;

  beforeEach(() => {
    productServiceSpy = jasmine.createSpyObj('ProductsService', ['getProducts']);
    productServiceSpy.getProducts.and.returnValue(of([
      { id: 1, name: 'Product 1', description: 'Description 1', price: 100, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Product 2', description: 'Description 2', price: 200, createdAt: new Date(), updatedAt: new Date() }
    ]));

    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ProductListComponent,
        MatTableModule, MatPaginatorModule, MatSortModule,
        RouterTestingModule,
      ],
      providers: [{ provide: ProductsService, useValue: productServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debería paginar los productos', () => {
    component.dataSource = new MatTableDataSource<Product>([
      { id: 1, name: 'Product 1', description: 'Description 1', price: 100, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Product 2', description: 'Description 2', price: 200, createdAt: new Date(), updatedAt: new Date() }
    ]);
    component.dataSource.sort = component.sort;
    component.dataSource.paginator = component.paginator;
    fixture.detectChanges();

    component.paginator.pageSize = 1; // Set page size to 1 for testing
    component.paginator.pageIndex = 0; // Go to the first page
    component.paginator.page.emit(); // Trigger page change

    fixture.detectChanges();

    const tableRows = fixture.nativeElement.querySelectorAll('mat-row');
    expect(tableRows.length).toBe(1); // Only 1 product should be displayed on the first page
  });

  it('Debería listar correctamente los productos en la tabla', () => {
    const tableRows = fixture.nativeElement.querySelectorAll('mat-row');
    expect(tableRows.length).toBeGreaterThan(1); // Assuming 2 products in the mock data
  });


  it('Debería eliminar un producto', () => {
    const productIdToDelete = 1; // Assuming product with ID 1 is being deleted
    spyOn(window, 'confirm').and.returnValue(true); // Mock the confirmation dialog

    component.onDelete(productIdToDelete);

    expect(productServiceSpy.deleteProduct).toHaveBeenCalledWith(productIdToDelete);
  });

  it('Debería navegar a la página de edición del producto', fakeAsync(() => {
    const productIdToEdit = 1; // Assuming product with ID 1 is being edited
    spyOn(router, 'navigateByUrl'); // Spy on the router's navigateByUrl method

    component.onEdit(productIdToEdit);

    expect(router.navigateByUrl).toHaveBeenCalledWith(`/products/${productIdToEdit}/edit`);
  }));

});
