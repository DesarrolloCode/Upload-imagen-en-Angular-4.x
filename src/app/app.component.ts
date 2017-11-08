import { Component, OnInit } from '@angular/core';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-4.x';
import { ProductoService } from './services/producto.service';
import { Producto } from './interfaces/producto.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  listaImagenes: any [] = [];
  listaCategorias: Producto [] = [];
  producto: Producto = {
    nombre: '',
    imagen: '',
  }

  public uploader: FileUploader;
  public hasBaseDropZoneOver = false;
  private title: string;
  public imageDataArray;

  constructor(private cloudinary: Cloudinary, private _productoServices: ProductoService) {
    this.title = '';
  }
  ngOnInit() {
    this._productoServices.consultarProductos()
      .subscribe(
        respuesta => {
          console.log(respuesta);
          for (let key$ in respuesta ) {
            let categoriaNew = respuesta[key$];
            categoriaNew.id = respuesta[key$].id;
            this.listaCategorias.push(categoriaNew);
          }
          for (let i in this.listaCategorias) {
            console.log(this.listaCategorias[i].imagen);
          }

          return this.listaCategorias;
        }
      );
      console.log(this.listaCategorias);


    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/image/upload`,
      autoUpload: false, // Cargar archivos automáticamente al agregarlos a la cola de carga
      isHTML5: true, // Use xhrTransport a favor de iframeTransport
      removeAfterUpload: true, // Calcule el progreso de forma independiente para cada archivo cargado
      headers: [ // XHR request headers
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ]
    };

    const upsertResponse = fileItem => {
      // Check if HTTP request was successful
      if (fileItem.status !== 200) {
        console.log('Upload to cloudinary Failed');
        console.log(fileItem);
        return false;
      }
      console.log(fileItem);
      console.log(fileItem.data.url);
      this.listaImagenes.push(fileItem.data.url);
    }

    this.uploader = new FileUploader(uploaderOptions);
    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      // Agregue el preajuste de carga sin firmar de Cloudinary al formulario de carga
      form.append('upload_preset', this.cloudinary.config().upload_preset);
      // Usar el valor predeterminado "withCredentials" para las solicitudes CORS
      fileItem.withCredentials = false;
      return { fileItem, form };
    }

    // Actualizar el modelo al finalizar la carga de un archivo
    this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) =>
      upsertResponse(
        {
          file: item.file, status,
          data: JSON.parse(response),
        }
      );
  }

  cargar() {
    console.log('Boton caragar');
    console.log(this.listaImagenes);
    this.producto.imagen = this.listaImagenes;
    console.log(this.producto);
    this._productoServices.nuevoProducto(this.producto).subscribe(
      resultado => {
        console.log(resultado);
        console.log('Imagen Guardada!!');
      }
    );
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
    console.log(this.hasBaseDropZoneOver);
  }
}
