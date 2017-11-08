import { Injectable } from '@angular/core';
import {Producto} from '../interfaces/producto.interface';
import {Http, Headers} from '@angular/http';
import 'rxjs/Rx';


@Injectable()
export class ProductoService {

  productosSails: string = 'http://port-1337.tienda-vynypm52876.codeanyapp.com/Imagenes';

  constructor(private _http: Http) { }

  nuevoProducto(producto: Producto) {
    return this._http.post(this.productosSails,JSON.stringify(producto)).map(
      resultado => {
        return resultado.json();
      }
    );
  }


  consultarProductos() {
    return this._http.get(this.productosSails)
      .map(
        respuesta => {
          return respuesta.json();
        }
      );
  }


}

