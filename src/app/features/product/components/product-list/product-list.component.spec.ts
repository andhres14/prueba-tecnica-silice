import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
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

  let mockProductService: ProductsService;

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductsService', ['getProducts', 'deleteProduct']);
    await TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ProductListComponent,
        MatTableModule, MatPaginatorModule, MatSortModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: ProductsService, useValue: mockProductService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('Debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debería listar los productos de ProductService', fakeAsync(() => {
       const mockProducts: Product[] = [
         { id: 1, name: 'Product 1', description: '...', price: 10, createdAt: new Date(), updatedAt: new Date() },
         { id: 2, name: 'Product 2', description: '...', price: 20, createdAt: new Date(), updatedAt: new Date() }
       ];
       (mockProductService.getProducts as jasmine.Spy).and.returnValue(of(mockProducts));

       component.getProductsList();
       tick();
       fixture.detectChanges();

       expect(component.dataSource.data).toEqual(mockProducts);
  }));

  it('Debería navegar a la página de edición cuando se hace click en el botón de editar', () => {
    const router = jasmine.createSpyObj('Router', ['navigateByUrl']);
    component.router = router;
    const productId = 1;
    component.onEdit(productId);

    expect(router.navigateByUrl).toHaveBeenCalledWith(`/products/${productId}/edit`);
  });



  it('Deberia confirmar la eliminación antes de llamar a OnDeleteAction', () => {
    const productId = 1;
    const confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
    const onDeleteActionSpy = spyOn(component, 'onDeleteAction');

    component.onDelete(productId);

    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(confirmSpy).toHaveBeenCalledWith('¿Seguro que desea eliminar este producto?');
    expect(onDeleteActionSpy).toHaveBeenCalledTimes(1);
    expect(onDeleteActionSpy).toHaveBeenCalledWith(productId);
  });

  it('Debería mostrar la cantidad correcta de productos por página.', fakeAsync(() => {
    const products = [
      { id: 1, name: 'Product 1', description: 'Description 1', price: 10.99, createdAt: '2022-01-01' },
      { id: 2, name: 'Product 2', description: 'Description 2', price: 9.99, createdAt: '2022-01-02' },
      { id: 3, name: 'Product 3', description: 'Description 3', price: 12.99, createdAt: '2022-01-03' },
      { id: 4, name: 'Product 4', description: 'Description 4', price: 11.99, createdAt: '2022-01-04' },
      { id: 5, name: 'Product 5', description: 'Description 5', price: 10.99, createdAt: '2022-01-05' },
    ];
    (mockProductService.getProducts as jasmine.Spy).and.returnValue(of(products));

    component.getProductsList();
    tick();
    fixture.detectChanges();

    const tableRows = fixture.nativeElement.querySelectorAll('table tr');
    expect(tableRows.length).toBe(6); // 5 productos + 1 fila cabecera
  }));


});
