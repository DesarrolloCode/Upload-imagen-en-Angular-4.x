import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

// Cloudinary module
import {CloudinaryModule, CloudinaryConfiguration, provideCloudinary} from '@cloudinary/angular-4.x';
import * as cloudinary from 'cloudinary-core';
import {CloudinarySettings} from './settings';
import { FileUploadModule } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { ProductoService } from './services/producto.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CloudinaryModule.forRoot(cloudinary, CloudinarySettings),
    FileUploadModule,
    BrowserModule,
    HttpModule
  ],
  providers: [ProductoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
