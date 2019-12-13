/**
 * Created by dattaram on 9/12/19.
 */
import {
    AfterContentInit, Component, ContentChildren, EventEmitter, Input, OnInit, Output,
    QueryList,
    OnChanges
} from '@angular/core';
import { ColumnComponent } from "./column.component";
import { DataService } from "./datatable.service";

@Component({
    selector: 'd-datatable',
    templateUrl: 'datatable.component.html',
    styleUrls: ['datatable.component.css'],
    providers: [DataService]
})

export class DatatableComponent implements OnInit, AfterContentInit, OnChanges {

    @Input() gridData: any[] = [];

    @Input() gridTitle: string;

    @Input() height: string;

    @Input() pageSize = 10;

    columnData: any[] = [];

    gridViewData: any[];

    numberOfPages = 0;

    activePageNumber = 1

    listOfColumnForSearch: any[] = [];

    searchValue = '';

    searchValueLength = 3;
    pagginationDataModel: PagginationDataModel;

    @Output() getRowData: EventEmitter<any> = new EventEmitter<any>();

    @ContentChildren(ColumnComponent) columnRef: QueryList<ColumnComponent>;


    constructor(private _dataService: DataService) {
        this.pagginationDataModel = new PagginationDataModel();
    }

    ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
        if (changes['gridData'] && changes.gridData.currentValue != changes.gridData.previousValue) {
            this._dataService.gridDataBehaviour.next(changes.gridData.currentValue);
            this._dataService.gridViewDataBehaviour.next(changes.gridData.currentValue);
        }
    }

    ngOnInit() {
        this._dataService.gridDataBehaviour.subscribe((data: any) => {
            if (data && data.length > 0) {
                this.gridData = data;
                this.createPagginationData();
            }
        });

        this._dataService.gridViewDataBehaviour.subscribe((data: any) => {
            if (data && data.length > 0) {
                this.createViewData(data);
            } else {
                this.gridViewData = [];
            }
        });
        this._dataService.columnDataBehaviour.subscribe((data: any) => {
            this.columnData = data;
        });
    }

    createPagginationData() {
        this.numberOfPages = Math.ceil(this.gridData.length / this.pageSize);
        this.pagginationDataModel = new PagginationDataModel(this.numberOfPages);

    }

    createViewData(data) {
        let startIndex: number;
        let endIndex: number;
        if (this.pagginationDataModel.activePage == 1) {
            startIndex = 0
            endIndex = this.pageSize;
        } else {
            startIndex = ((this.pagginationDataModel.activePage - 1) * this.pageSize);
            endIndex = (this.pagginationDataModel.activePage * this.pageSize);
        }
        this.gridViewData = data.slice(startIndex, endIndex);

    }

    ngAfterContentInit() {
        this.createColumnConfig();
    }
    createColumnConfig() {
        if (this.columnRef) {
            this.columnData = this.columnRef.toArray();
            this.columnData[0].selectedForSearch = true;
            this._dataService.columnData = this.columnData;
        }
    }


    trackByRow(index: any) {
        return index;
    }

    trackByColumn(index: any) {
        return index;
    }

    onRowClick(row: any) {
        this.getRowData.emit(row);
    }

    nextClickHandle() {


        this.pagginationDataModel.createNextSetOfViewData(2);

        if (this.pagginationDataModel.lastIndex != this.activePageNumber) {
            this.activePageNumber = this.activePageNumber + 1;
            this.createViewData(this.gridData);
        }
    }

    prevClickHandle() {
        this.pagginationDataModel.createNextSetOfViewData(1);

        if (this.activePageNumber != 1) {
            this.activePageNumber = this.activePageNumber - 1;
            this.createViewData(this.gridData);
        }
    }

    goToTopClickHandle() {
        this.pagginationDataModel.topSetOfData();
        this.pagginationDataModel.activePage
    }

    goToBootomClickHandle() {
        this.pagginationDataModel.bottomSetOfEndData();
    }

    onPageSelectHandle(activeNumbar: number) {
        this.pagginationDataModel.activePage = activeNumbar;
        this.createViewData(this.gridData);
    }


    sortHandle(column: ColumnComponent) {
        column.sort = !column.sort;
        this.gridViewData.sort((x, y) => {
            return (x[column.dataKey].toLowerCase() === y[column.dataKey].toLowerCase() ? 0 : x[column.dataKey].toLowerCase() < y[column.dataKey].toLowerCase() ? -1 : 1) * (column.sort ? 1 : -1)
        });
        this._dataService.gridViewDataBehaviour.next(this.gridViewData);
    }

    selectColumnForSearchHandle(column: ColumnComponent) {
        column.selectedForSearch = !column.selectedForSearch;
    }

    SearchHandle() {
        const selectColumnList = this.columnData.filter((col) => (!col.hidden && col.selectedForSearch));
        let dummyData = Object.assign([], this.gridData);
        let resultData = [];
        if (this.searchValue != '' && this.searchValue.length >= this.searchValueLength) {
            if (selectColumnList && selectColumnList.length > 0 && this.searchValue != '') {
                selectColumnList.forEach((col: ColumnComponent) => {
                    dummyData.forEach((data: any, index: any) => {
                        if (data) {
                            if (data[col.dataKey] && data[col.dataKey].toLowerCase().includes(this.searchValue)) {
                                resultData[index] = data;
                                dummyData[index] = null;
                            }
                        }
                    });
                });
                resultData = resultData.filter(() => { return true });
            } else {
                resultData = this.gridData;
            }
        } else {
            resultData = this.gridData;
        }
        this._dataService.gridViewDataBehaviour.next(resultData);
    }

}

export class PagginationDataModel {
    startIndex = 1;
    lastIndex: number;
    pageListViewArray: any[] = []
    viewPageIndexlist: any[] = [];
    viewStartIndex = 1;
    viewLastLIndex = 4
    showPageList = false;
    activePage = 1;

    constructor(lastI?: number) {
        this.lastIndex = lastI;
        if (lastI) {
            this.convertNumberIntoArray();
        }
    }

    convertNumberIntoArray() {
        for (let index = 1; index <= this.lastIndex; index++) {
            this.pageListViewArray.push(index);
        }
        this.createViewPageIndexList(this.viewStartIndex, this.viewLastLIndex);
    }

    createViewPageIndexList(startI: number, endI: number) {
        if (this.pageListViewArray.length > 1) {
            this.viewPageIndexlist = this.pageListViewArray.slice(startI, endI);
            this.showPageList = true;
        }
    }

    createNextSetOfViewData(optNumber: number) {
        if (optNumber == 2 && this.viewLastLIndex != (this.lastIndex - 1)) {
            this.viewStartIndex = this.viewStartIndex + 1;
            this.viewLastLIndex = this.viewLastLIndex + 1;
        } else if (optNumber == 1 && this.viewStartIndex != 1) {
            this.viewStartIndex = this.viewStartIndex - 1;
            this.viewLastLIndex = this.viewLastLIndex - 1;
        }
        this.viewPageIndexlist = this.pageListViewArray.slice(this.viewStartIndex, this.viewLastLIndex);

    }

    topSetOfData() {
        this.activePage = 1;
        this.viewStartIndex = 1;
        this.viewLastLIndex = 4;
        this.viewPageIndexlist = this.pageListViewArray.slice(this.viewStartIndex, this.viewLastLIndex);
    }

    bottomSetOfEndData() {
        this.viewStartIndex = ((this.lastIndex - 1) - 3);
        this.viewLastLIndex = (this.lastIndex - 1);
        this.viewPageIndexlist = this.pageListViewArray.slice(this.viewStartIndex, this.viewLastLIndex);
    }
}
