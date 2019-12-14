<h1 align="center">
    D-Datatable
  <br>
</h1>

## Angular CLI - Installation

### Overview

The Angular CLI is a tool to initialize, develop, scaffold and maintain Angular applications

### Getting Started

To install the Angular CLI:

```bash
npm install -g @angular/cli
```
Generating and serving an Angular project via a development server Create and run a new project:

```bash
ng new my-project
cd my-project
ng serve
```

Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

For More on Angular CLI [commands](https://github.com/angular/angular-cli/wiki) click on the link.

## D-datatable - Installation

To install this library, follow the steps given below:

```bash
$ cd your-angular-project
```

```bash
$ npm install d-datatable --save
```

```bash
$ npm install font-awesome@4.7.0 --save
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { DDatatableModule } from 'd-datatable';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule, DDatatableModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
```
# d-datatable Properties

<table> 
<tr>
<th>Name</th>
<th>String</th>
<th>Default Value</th>
</tr>
<tr>
 <td>gridData</td>
 <td>Array</td>
 <td>[]</td>
</tr>
<tr>
 <td>pageSize</td>
 <td>Number</td>
 <td>10</td>
</tr>
<tr>
 <td>height</td>
 <td>String</td>
 <td></td>
</tr>
<tr>
 <td>gridTitle</td>
 <td>String</td>
 <td></td>
</tr>
</table>


# d-column Properties

<table> 
<tr>
<th>Name</th>
<th>String</th>
<th>Default Value</th>
</tr>
<tr>
 <td>label</td>
 <td>String</td>
 <td></td>
</tr>
<tr>
 <td>dataKey</td>
 <td>Sring</td>
 <td></td>
</tr>
<tr>
 <td>width</td>
 <td>String</td>
 <td></td>
</tr>
<tr>
 <td>hidden</td>
 <td>Boolean</td>
 <td>false</td>
</tr>
</table>