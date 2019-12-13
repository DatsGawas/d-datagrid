import { NgModule, ModuleWithProviders } from '@angular/core';
import { DatatableComponent } from './datatable/datatable.component';
import { DataService } from './datatable/datatable.service';
import { CommonModule } from '@angular/common';
import { ColumnComponent } from './datatable/column.component';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [DatatableComponent, ColumnComponent],
    imports: [CommonModule, FormsModule],
    exports: [DatatableComponent, ColumnComponent]
})
export class DDatatableModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DDatatableModule,
            providers: [DataService]
        };
    }
}
