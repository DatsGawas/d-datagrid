import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  data: any[] = [];
  constructor() {
    this.data = [
      {
        empName: "dattaram Gawas",
        empCode: 11
      },
      {
        empName: "Sudarshan Hiray",
        empCode: 12
      },
      {
        empName: "dattaram Gawas",
        empCode: 11
      },
      {
        empName: "Sudarshan Hiray",
        empCode: 12
      },
      {
        empName: "dattaram Gawas",
        empCode: 11
      },
      {
        empName: "Sudarshan Hiray",
        empCode: 12
      },
      {
        empName: "dattaram Gawas",
        empCode: 11
      },
      {
        empName: "Sudarshan Hiray",
        empCode: 12
      }
    ];
  }
}
