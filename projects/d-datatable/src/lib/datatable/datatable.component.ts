/**
 * Created by dattaram on 9/12/19.
 */
import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  OnChanges
} from "@angular/core";
import { ColumnComponent } from "./column.component";
import { DataService } from "./datatable.service";
import { Subscription } from "rxjs";

@Component({
  selector: "d-datatable",
  templateUrl: "datatable.component.html",
  styleUrls: ["datatable.component.css"],
  providers: [DataService]
})
export class DatatableComponent implements OnInit, AfterContentInit, OnChanges {
  /**
   * actual data to be render in data grid
   *
   * @type {any[]}
   * @memberof DatatableComponent
   */
  @Input() gridData: any[] = [];

  /**
   * column data
   *
   * @type {any[]}
   * @memberof DatatableComponent
   */
  @Input() columnData: any[] = [];

  /**
   * title for data grid
   *
   * @type {string}
   * @memberof DatatableComponent
   */
  @Input() gridTitle: string = "Datta";

  /**
   * heigth for data grid
   *
   * @type {string}
   * @memberof DatatableComponent
   */
  @Input() height: string;

  /**
   * number of record in one page
   *
   * @memberof DatatableComponent
   */
  @Input() pageSize = 10;

  /**
   * binded to the view and filterd grid data
   *
   * @type {any[]}
   * @memberof DatatableComponent
   */
  gridViewData: any[];

  /**
   * store number of pages depending on total record and page size calculation
   *
   * @memberof DatatableComponent
   */
  numberOfPages = 0;

  /**
   * store list of column which are going to use for searching
   *
   * @type {any[]}
   * @memberof DatatableComponent
   */
  listOfColumnForSearch: any[] = [];

  /**
   * store search value
   *
   * @memberof DatatableComponent
   */
  searchValue = "";

  /**
   * search functionality will start after atleast 3 character entered
   *
   * @memberof DatatableComponent
   */
  searchValueLength = 3;
  /**
   * created model for pagination functionality
   *
   * @type {PagginationDataModel}
   * @memberof DatatableComponent
   */
  pagginationDataModel: PagginationDataModel;

  /**
   * event used for emit selected row data
   *
   * @type {EventEmitter<any>}
   * @memberof DatatableComponent
   */
  @Output() getRowData: EventEmitter<any> = new EventEmitter<any>();

  /**
   * reference of column tag
   *
   * @type {QueryList<ColumnComponent>}
   * @memberof DatatableComponent
   */
  @ContentChildren(ColumnComponent) columnRef: QueryList<ColumnComponent>;

  /**
   * store subscribtion of grid data
   *
   * @type {Subscription}
   * @memberof DatatableComponent
   */
  gridDataSubscribtion: Subscription;

  /**
   * store subscribtion of grid view data
   *
   * @type {Subscription}
   * @memberof DatatableComponent
   */
  gridViewDataSubscribtion: Subscription;

  /**
   * store subscribtion of column data
   *
   * @type {Subscription}
   * @memberof DatatableComponent
   */
  columnDataSubscribtion: Subscription;

  /**
   * show or hide column dropdown
   *
   * @memberof DatatableComponent
   */
  showColumnDropdown = false;

  /**
   * Creates an instance of DatatableComponent.
   * creates an instance of PagginationDataModel
   * @param {DataService} _dataService
   * @memberof DatatableComponent
   */
  constructor(private _dataService: DataService) {
    this.pagginationDataModel = new PagginationDataModel();
  }

  /**
   * detect changes of gridData input property and do appropriate action
   *
   * @param {import("@angular/core").SimpleChanges} changes
   * @memberof DatatableComponent
   */
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (
      changes["gridData"] &&
      changes.gridData.currentValue != changes.gridData.previousValue
    ) {
      this._dataService.gridDataBehaviour.next(changes.gridData.currentValue);
      this._dataService.gridViewDataBehaviour.next(
        changes.gridData.currentValue
      );
    }

    if (
      changes["columnData"] &&
      changes.columnData.currentValue != changes.columnData.previousValue
    ) {
      this.columnData = changes.columnData.currentValue;

      this.createColumnConfig();
    }
  }

  /**
   * subscribe dataservice observable
   * add initial logic
   *
   * @memberof DatatableComponent
   */
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

  focusHandle() {
    this.showColumnDropdown = true;
  }

  /**
   * create Paggination DataModel Object
   * find number of pages
   * @memberof DatatableComponent
   */
  createPagginationData() {
    this.numberOfPages = Math.ceil(this.gridData.length / this.pageSize);
    this.pagginationDataModel = new PagginationDataModel(this.numberOfPages);
  }

  /**
   * create view data accroding page size
   *
   * @param {any[]} data
   * @memberof DatatableComponent
   */
  createViewData(data: any[]) {
    let startIndex: number;
    let endIndex: number;
    if (this.pagginationDataModel.activePage == 1) {
      startIndex = 0;
      endIndex = this.pageSize;
    } else {
      startIndex = (this.pagginationDataModel.activePage - 1) * this.pageSize;
      endIndex = this.pagginationDataModel.activePage * this.pageSize;
    }
    this.gridViewData = data.slice(startIndex, endIndex);
  }

  /**
   * implement ngAfterContentInit interface
   *
   * @memberof DatatableComponent
   */
  ngAfterContentInit() {
    this.columnData = this.columnRef.toArray();
    this.createColumnConfig();
  }
  /**
   * create column cofig object
   *
   * @memberof DatatableComponent
   */
  createColumnConfig() {
    if (this.columnData && this.columnData.length > 0) {
      if (this.columnData && this.columnData.length) {
        for (let index = 0; index < this.columnData.length; index++) {
          if (!this.columnData[index].hidden) {
            this.columnData[index].selectedForSearch = true;
            return;
          }
        }
      }
      this._dataService.columnData = this.columnData;
    }
  }

  /**
   * implement Trackby for Row Iteration
   *
   * @param {*} index
   * @returns
   * @memberof DatatableComponent
   */
  trackByRow(index: any) {
    return index;
  }

  /**
   * implement Trackby for Column Iteration
   *
   * @param {*} index
   * @returns
   * @memberof DatatableComponent
   */
  trackByColumn(index: any) {
    return index;
  }

  /**
   * emit Row click data
   *
   * @param {*} row
   * @memberof DatatableComponent
   */
  onRowClick(row: any) {
    this.getRowData.emit(row);
  }

  /**
   * create next set of page index's
   *
   * @memberof DatatableComponent
   */
  nextClickHandle() {
    this.pagginationDataModel.createNextSetOfViewData(2);
    if (
      this.pagginationDataModel.lastIndex !=
      this.pagginationDataModel.activePage
    ) {
      this.createViewData(this.gridData);
    }
  }

  /**
   * create prev set of page index's
   *
   * @memberof DatatableComponent
   */
  prevClickHandle() {
    this.pagginationDataModel.createNextSetOfViewData(1);
    this.createViewData(this.gridData);
  }

  /**
   * go to first page
   *
   * @memberof DatatableComponent
   */
  goToTopClickHandle() {
    this.pagginationDataModel.topSetOfData();
    this.createViewData(this.gridData);
  }

  /**
   * go to last page
   *
   * @memberof DatatableComponent
   */
  goToBootomClickHandle() {
    this.pagginationDataModel.bottomSetOfEndData();
    this.createViewData(this.gridData);
  }

  /**
   * on individual page click filter data
   *
   * @param {number} activeNumbar
   * @memberof DatatableComponent
   */
  onPageSelectHandle(activeNumbar: number) {
    this.pagginationDataModel.activePage = activeNumbar;
    this.createViewData(this.gridData);
  }

  /**
   * do asc and desc sort visa versa
   *
   * @param {ColumnComponent} column
   * @memberof DatatableComponent
   */
  sortHandle(column: ColumnComponent) {
    column.sort = !column.sort;
    this.gridViewData.sort((a, b) => {
      let x;
      let y;
      if (column.dataKey.includes(".")) {
        x = this.sortInnerFunc(column.dataKey, a).toLowerCase();
        y = this.sortInnerFunc(column.dataKey, b).toLowerCase();
      } else {
        x = a[column.dataKey].toLowerCase();
        y = b[column.dataKey].toLowerCase();
      }
      return (x == y ? 0 : x < y ? -1 : 1) * (column.sort ? 1 : -1);
    });
    this._dataService.gridViewDataBehaviour.next(this.gridViewData);
  }

  sortInnerFunc(temp: string, data: any) {
    let value;
    let i = 0;
    const strarr = temp.split(".");
    for (i = 0; i < strarr.length; i++) {
      if (i === 0) {
        value = data[strarr[i]];
      } else {
        const tmp = strarr[i];
        value = value[tmp];
        return value;
      }
    }
  }

  /**
   * add or remove column from search column array
   *
   * @param {ColumnComponent} column
   * @memberof DatatableComponent
   */
  selectColumnForSearchHandle(column: ColumnComponent) {
    column.selectedForSearch = !column.selectedForSearch;
  }

  /**
   * do search operation on basic of selected column
   *
   * @memberof DatatableComponent
   */
  SearchHandle() {
    const selectColumnList = this.columnData.filter(
      col => !col.hidden && col.selectedForSearch
    );
    let dummyData = Object.assign([], this.gridData);
    let resultData = [];
    if (
      this.searchValue != "" &&
      this.searchValue.length >= this.searchValueLength
    ) {
      if (
        selectColumnList &&
        selectColumnList.length > 0 &&
        this.searchValue != ""
      ) {
        selectColumnList.forEach((col: ColumnComponent) => {
          dummyData.forEach((data: any, index: any) => {
            if (data) {
              let x;
              if (col.dataKey.includes(".")) {
                x = this.sortInnerFunc(col.dataKey, data).toLowerCase();
              } else {
                x = data[col.dataKey].toLowerCase();
              }
              if (x && x.includes(this.searchValue)) {
                resultData[index] = data;
                dummyData[index] = null;
              }
            }
          });
        });
        resultData = resultData.filter(() => {
          return true;
        });
      } else {
        resultData = this.gridData;
      }
    } else {
      resultData = this.gridData;
    }
    this._dataService.gridViewDataBehaviour.next(resultData);
  }

  /**
   * implement ngOnDestroy Interface
   *
   * @memberof DatatableComponent
   */
  ngOnDestroy(): void {
    if (this.gridDataSubscribtion) {
      this.gridDataSubscribtion.unsubscribe();
    }
    if (this.gridViewDataSubscribtion) {
      this.gridViewDataSubscribtion.unsubscribe();
    }
    if (this.columnDataSubscribtion) {
      this.columnDataSubscribtion.unsubscribe();
    }
  }
}

export class PagginationDataModel {
  startIndex = 1;
  lastIndex: number;
  pageListViewArray: any[] = [];
  viewPageIndexlist: any[] = [];
  viewStartIndex = 1;
  viewLastLIndex = 4;
  showPageList = false;
  activePage = 1;
  showArrow = true;

  /**
   *Creates an instance of PagginationDataModel.
   * @param number [lastI]
   * @memberof PagginationDataModel
   */
  constructor(lastI?: number) {
    this.lastIndex = lastI;
    if (lastI) {
      this.convertNumberIntoArray();
    }
  }

  /**
   * create pagenumber iteger into array of intergers for showing number of pages
   *
   * @memberof PagginationDataModel
   */
  convertNumberIntoArray() {
    for (let index = 1; index < this.lastIndex; index++) {
      this.pageListViewArray.push(index);
    }
    if (this.pageListViewArray.length < this.viewLastLIndex) {
      this.viewLastLIndex = this.pageListViewArray.length;
    }
    this.createViewPageIndexList(this.viewStartIndex, this.viewLastLIndex);
  }

  /**
   * creates an set of page data for UI
   *
   * @param number startI
   * @param number endI
   * @memberof PagginationDataModel
   */
  createViewPageIndexList(startI: number, endI: number) {
    if (this.pageListViewArray.length > 1) {
      this.viewPageIndexlist = this.pageListViewArray.slice(startI, endI);
      this.showPageList = true;
    } else {
      this.showArrow = false;
    }
  }

  /**
   * creates an set of page data for UI on Prev and Next click
   *
   * @param number optNumber
   * @memberof PagginationDataModel
   */
  createNextSetOfViewData(optNumber: number) {
    if (optNumber == 2 && this.viewLastLIndex != this.lastIndex - 1) {
      this.viewStartIndex = this.viewStartIndex + 1;
      this.viewLastLIndex = this.viewLastLIndex + 1;
    } else if (optNumber == 1 && this.viewStartIndex != 1) {
      this.viewStartIndex = this.viewStartIndex - 1;
      this.viewLastLIndex = this.viewLastLIndex - 1;
    }
    this.viewPageIndexlist = this.pageListViewArray.slice(
      this.viewStartIndex,
      this.viewLastLIndex
    );
  }

  /**
   *
   * do first page click operation
   *
   * @memberof PagginationDataModel
   */
  topSetOfData() {
    this.activePage = 1;
    this.viewStartIndex = 1;
    if (this.viewStartIndex + 3 > this.pageListViewArray.length) {
      this.viewLastLIndex = this.pageListViewArray.length;
    } else if (this.viewStartIndex + 3 < this.viewLastLIndex) {
      this.viewLastLIndex = 4;
    }
    this.viewPageIndexlist = this.pageListViewArray.slice(
      this.viewStartIndex,
      this.viewLastLIndex
    );
  }

  /**
   * do last click operation
   *
   * @memberof PagginationDataModel
   */
  bottomSetOfEndData() {
    this.activePage = this.lastIndex;
    if (this.lastIndex - 1 - 3 < 1) {
      this.viewStartIndex = 1;
    } else {
      this.viewStartIndex = this.lastIndex - 1 - 3;
    }
    this.viewLastLIndex = this.lastIndex - 1;
    this.viewPageIndexlist = this.pageListViewArray.slice(
      this.viewStartIndex,
      this.viewLastLIndex
    );
  }
}
