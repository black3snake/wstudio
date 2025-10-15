import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './views/main/main.component';
import { LayoutComponent } from './shared/layout/layout.component';
import {SharedModule} from "./shared/shared.module";
import {FooterComponent} from "./shared/footer/footer.component";
import {HeaderComponent} from "./shared/header/header.component";

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LayoutComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
