import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GlobalConstants } from "../common/global-constants";
import { AuthGuard } from './auth.guard';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

/**
 * Services for Products(Merchandise) Modules
*/
export class ProductService {

  // Definimos las variables globales
  urlEndPoint: String = GlobalConstants.apiURL;
  httpOptions = {};

  constructor(
    private http: HttpClient,
    private auth: AuthGuard
  ) {
    // Validamos que exista un token en la cache
    if (!localStorage.getItem('token')) {
      this.auth.closeLocalSession();
    }
    // Definimos nuestro header para usar en nuestras peticiones
    this.httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
        'Content-Type': 'application/json',
      })
    };
  }

  /* PRODUCTS */
  opts: any = [];
  // Obtiene los productos y servicios de forma mas compacta
  getProducsAndServices() {
    return this.opts.length ?
      of(this.opts) :
      this.http.get(this.urlEndPoint + '/porte/productos-and-servicios', this.httpOptions).pipe(tap(data => this.opts = data))
  }
  // OBtiene todas las mercancías
  getProducts(in_category = false, in_mark = false, in_measure_unit = false, in_provider = false,
    spendings = false, is_used = false, not_used = false, locations = false, dataDeleted = false): any {
    let included = '';
    if (in_category) {
      included += 'category,';
    }
    if (in_mark) {
      included += 'mark,';
    }
    if (in_measure_unit) {
      included += 'measure_unit,';
    }
    if (in_provider) {
      included += 'supplies.provider,';
    }
    if (spendings) {
      included += 'expenses.spendings,';
    }
    if (is_used) {
      included += 'is_used,';
    }
    if (not_used) {
      included += 'not_used,';
    }
    if (locations) {
      included += 'locations,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete + '/products?sort=-updated_at&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getProductByID(_id: number, in_category = false, in_mark = false, in_measure_unit = false, in_provider = false,
    spendings = false, is_used = false, not_used = false, locations = false, dataDeleted = false): any {
    let included = '';
    if (in_category) {
      included += 'category,';
    }
    if (in_mark) {
      included += 'mark,';
    }
    if (in_measure_unit) {
      included += 'measure_unit,';
    }
    if (in_provider) {
      included += 'supplies.provider,';
    }
    if (spendings) {
      included += 'expenses.spendings,';
    }
    if (is_used) {
      included += 'is_used,';
    }
    if (not_used) {
      included += 'not_used,';
    }
    if (locations) {
      included += 'locations,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete + '/products/' + _id + '?included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeProduct(data: any) {
    return this.http.post(this.urlEndPoint + '/products', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateProduct(data: any) {
    return this.http.put(this.urlEndPoint + '/products/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteProduct(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/products/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreProduct(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/products/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* CATEGORIES */
  getCategories(in_products = false, dataDeleted = false): any {
    let included = '';
    if (in_products) {
      included += 'products,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete + '/categories?sort=-updated_at&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getCategorieByID(_id: number, in_products = false, dataDeleted = false): any {
    let included = '';
    if (in_products) {
      included += 'products,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete + '/categories/' + _id + '?included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeCategory(data: any) {
    return this.http.post(this.urlEndPoint + '/categories', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateCategory(data: any) {
    return this.http.put(this.urlEndPoint + '/categories/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteCategory(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/categories/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreCategory(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/categories/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* MEASURE UNITS */
  getMeasureUnits(dataDeleted = false): any {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete + '/measure-units?sort=-updated_at', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getMeasureUnitByID(_id: number, in_products = false, dataDeleted = false): any {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    let included = '';
    if (in_products) {
      included += 'products,';
    }
    return this.http.get(this.urlEndPoint + _delete + '/measure-units/' + _id + '?included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeMeasureUnit(data: any) {
    return this.http.post(this.urlEndPoint + '/measure-units', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateMeasureUnit(data: any) {
    return this.http.put(this.urlEndPoint + '/measure-units/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteMeasureUnit(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/measure-units/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreMeasureUnit(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/measure-units/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* LOCATIONS */
  getLocations(in_products = false, is_used = false, not_used = false, dataDeleted = false): any {
    let included = '';
    if (in_products) {
      included += 'products,';
    }
    if (is_used) {
      included += 'is_used,';
    }
    if (not_used) {
      included += 'not_used,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete + '/locations?sort=-updated_at&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getLocationByID(_id: number, in_products = false, is_used = false, not_used = false, dataDeleted = false): any {
    let included = '';
    if (in_products) {
      included += 'products,';
    }
    if (is_used) {
      included += 'is_used,';
    }
    if (not_used) {
      included += 'not_used,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete + '/locations/' + _id + '?included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeLocation(data: any) {
    return this.http.post(this.urlEndPoint + '/locations', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateLocation(data: any) {
    return this.http.put(this.urlEndPoint + '/locations/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteLocation(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/locations/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreLocation(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/locations/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* LOSSES */
  getLosses(in_products = false, in_user = false, dataDeleted = false): any {
    let included = '';
    if (in_products) {
      included += 'product,';
    }
    if (in_user) {
      included += 'user,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete + '/losses?sort=-updated_at&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getLosseByID(_id: number, in_products = false, in_user = false, dataDeleted = false): any {
    let included = '';
    if (in_products) {
      included += 'product,';
    }
    if (in_user) {
      included += 'user,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete + '/losses/' + _id + '?included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeLosses(data: any) {
    return this.http.post(this.urlEndPoint + '/losses', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateLosses(data: any) {
    return this.http.put(this.urlEndPoint + '/losses/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteLosses(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/losses/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreLosses(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/losses/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* PROVIDERS */
  getProviders(dataDeleted = false): any {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete + '/providers?sort=-updated_at', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getProviderByID(_id: number, in_address: boolean = false, in_products: boolean = false, dataDeleted = false) {
    let included = '';
    if (in_address) {
      included += 'addressables.address,';
    } if (in_products) {
      included += 'supplies.products,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete + '/providers/' + _id + '?included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeProvider(data: any) {
    return this.http.post(this.urlEndPoint + '/providers', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateProvider(data: any) {
    return this.http.put(this.urlEndPoint + '/providers/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteProvider(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/providers/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreProvider(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/providers/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* SPENDING */
  getSpendings(in_expenses: boolean = false, in_products: boolean = false, dataDeleted = false): any {
    let included = '';
    if (in_expenses) {
      included += 'expenses,';
    } if (in_products) {
      included += 'expenses.products,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete + '/spendings?sort=-updated_at&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getSpendingByID(_id: number, in_expenses: boolean = false, in_products: boolean = false, dataDeleted = false) {
    let included = '';
    if (in_expenses) {
      included += 'expenses,';
    } if (in_products) {
      included += 'expenses.products,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete + '/spendings/' + _id + '?included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeSpending(data: any) {
    return this.http.post(this.urlEndPoint + '/spendings', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateSpending(data: any) {
    return this.http.put(this.urlEndPoint + '/spendings/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteSpending(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/spendings/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreSpending(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/spendings/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* EXPENSES */
  getExpenses(in_spendings: boolean = false, in_products: boolean = false, dataDeleted = false): any {
    let included = '';
    if (in_spendings) {
      included += 'spendings,';
    } if (in_products) {
      included += 'products,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete + '/expenses?sort=-updated_at&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getExpenseByID(_id: number, in_spendings: boolean = false, in_products: boolean = false, dataDeleted = false) {
    let included = '';
    if (in_spendings) {
      included += 'spendings,';
    } if (in_products) {
      included += 'products,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete + '/expenses/' + _id + '?included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeExpense(data: any) {
    return this.http.post(this.urlEndPoint + '/expenses', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateExpense(data: any) {
    return this.http.put(this.urlEndPoint + '/expenses/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteExpense(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/expenses/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreExpense(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/expenses/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* SUPPLIES */
  getSupplies(in_provider = false, in_products = false, dataDeleted = false): any {
    let included = '';
    if (in_provider) {
      included += 'provider,';
    }
    if (in_products) {
      included += 'products,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete + '/supplies?sort=-updated_at&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getSupplieByID(_id: number, in_provider = false, in_products = false, dataDeleted = false): any {
    let included = '';
    if (in_provider) {
      included += 'provider,';
    }
    if (in_products) {
      included += 'products,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete + '/supplies/' + _id + '?included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeSupplie(data: any) {
    return this.http.post(this.urlEndPoint + '/supplies', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateSupplie(data: any) {
    return this.http.put(this.urlEndPoint + '/supplies/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteSupplie(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/supplies/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreSupplie(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/supplies/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* BRANDS */
  getMarks(_id: number = 0, in_products = false, dataDeleted = false): any {
    let included = '';
    if (in_products) {
      included += 'products,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    let id = '';
    if (_id !== 0) {
      id = '/' + _id
    }
    return this.http.get(this.urlEndPoint + _delete + '/marks' + id + '?sort=-updated_at&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeMark(data: any) {
    return this.http.post(this.urlEndPoint + '/marks', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateMark(data: any) {
    return this.http.put(this.urlEndPoint + '/marks/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteMark(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/marks/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreMark(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/marks/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
}