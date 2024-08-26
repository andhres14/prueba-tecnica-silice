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

  it('Deberia actualizar el producto existente', () => {
    const existingProduct: Product = {
      id: 1,
      name: 'Producto nuevo',
      description: 'Descripción',
      price: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const updatedProduct = { ...existingProduct, name: 'Updated Product' };
    service.updateProduct(updatedProduct).subscribe(result => {
      expect(result).toBeTrue();
      service.getProducts().subscribe(products => {
        expect(products).toContain(updatedProduct);
      })
      //expect(service.getProducts().getValue()).toContain(updatedProduct);
    });
  });

  it('Deberia eliminar un producto existente', () => {
    const productToDelete = {
      id: 2,
      name: 'Producto to Delete',
      description: 'Descripción delete',
      price: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    service.addProduct(productToDelete);
    service.deleteProduct(productToDelete.id).subscribe(result => {
      expect(result).toBeTrue();
      service.getProducts().subscribe(products => {
        expect(products).not.toContain(productToDelete);
      })
      //expect(service.getProducts().getValue()).not.toContain(productToDelete);
    });
  });

  it('should get the list of products', () => {
    const products = [
      { id: 1, name: 'Product 1', description: 'Desc', price: 20000, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Product 2', description: 'Desc', price: 20000, createdAt: new Date(), updatedAt: new Date() },
    ];
    service.getProducts().subscribe(result => {
      expect(result).toEqual(products);
    });
  });


});

describe('TodoService', () => {
  let todoService: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService],
    });
    todoService = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Deberia retornar el item con ID 1', () => {
    const mockTodo = {
      userId: 1,
      id: 1,
      title: 'delectus aut autem',
      completed: false,
    };

    todoService.getTodoById(1).subscribe(todo => {
      expect(todo).toEqual(mockTodo);
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/todos/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTodo);
  });
});
