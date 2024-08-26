import { TestBed } from '@angular/core/testing';

import { ProductsService } from './products.service';
import { TodoService } from '@utils/todo.service';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Product } from '../models/product.model';
import { SnackBarService } from '@shared/services/snack-bar.service';


describe('ProductsService', () => {
  let service: ProductsService;
  let todoService: TodoService;
  let snackBarServiceSpy: jasmine.SpyObj<SnackBarService>;

  beforeEach(() => {
    snackBarServiceSpy = jasmine.createSpyObj('SnackBarService', ['showSnackBar']);
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        ProductsService,
        TodoService,
        { provide: SnackBarService, useValue: snackBarServiceSpy },
      ],
    });
    service = TestBed.inject(ProductsService);
    todoService = TestBed.inject(TodoService);
  });

  it('Debe agregar un nuevo producto', () => {
       const productToAdd: Product = {
        id: 1,
        name: 'Producto nuevo',
        description: 'Descripción',
        price: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      service.addProduct(productToAdd).subscribe(result => {
        expect(result).toBeTrue();
        service.getProducts().subscribe(products => {
          expect(products).toContain(productToAdd);
          expect(snackBarServiceSpy.showSnackBar).toHaveBeenCalledWith(
            'Producto agregado correctamente',
            'success'
          );
        })
      });
    });
});
