/**
 * Created by dattaram on 9/12/19.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class DataService {
    private gridData$: any;
    private gridData: any[] = [];
    columnData: any[] = [];
    gridDataBehaviour = new BehaviorSubject([]);
    gridViewDataBehaviour = new BehaviorSubject([]);
    columnDataBehaviour = new BehaviorSubject([]);

    private dataSourcekey: string;
    constructor(private _httpClient: HttpClient) {
    }

    setDataByUrl(url: string, type: string, dataSourcekey?: string) {
        this.dataSourcekey = dataSourcekey;
        this.gridData$ = this.getGridDataObservable(url);
        this.subscribeGridData(this.gridData$);
    }

    pushObjectIntoGrid(gridObject: any, insertAtTop?: boolean, index?: number) {
        if (insertAtTop) {
            this.gridData.unshift(gridObject);
        } else if (index <= this.gridData.length - 1) {
            this.gridData.splice(index, 0, gridObject);
        } else {
            this.gridData.push(gridObject);
        }
        this.publishData();
    }

    margeDataIntoGrid(data: any[]) {
        this.gridData = this.gridData.concat(data);
        this.publishData();
    }

    addColumn(columnObject: any) {
        this.columnData.push(columnObject);
        this.columnDataBehaviour.next(this.columnData);
    }

    changeColumnStructure(columnData: any[]) {
        this.columnData = [];
        this.columnDataBehaviour.next(columnData);
    }

    private getGridDataObservable(url: string) {
        return this._httpClient.get(url).pipe(
            map(
                x => {
                    return this.getGridData(x);
                }
            )
        );
    }

    private getGridData(httpResponse: any) {
        let responsedata = httpResponse;
        if (this.dataSourcekey != null) {
            const dr = this.dataSourcekey.split('.');
            for (const ir of dr) {
                responsedata = responsedata[ir];
            }
        } else {
            responsedata = httpResponse;
        }

        return responsedata;
    }

    private subscribeGridData(subScData$: Observable<any>) {
        subScData$.subscribe(
            res => {
                this.gridData = res;
                this.publishData();
            }
        );
    }

    getData(): any {
        return this.gridData;
    }

    private publishData() {
        this.gridDataBehaviour.next(this.gridData);
        this.gridViewDataBehaviour.next(this.gridData);
    }
}

