import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { DDatatableModule } from "projects/d-datatable/src/public-api";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, DDatatableModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
