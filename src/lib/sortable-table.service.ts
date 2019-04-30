import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SortableTableService {

    constructor() { }

    private columnSortedSource = new Subject<ColumnSortedEvent>();
    private columnFilteredSource = new Subject<ColumnSortedEvent>();

    columnSorted$ = this.columnSortedSource.asObservable();
    columnFiltered$ = this.columnFilteredSource.asObservable();

    columnSorted(event: ColumnSortedEvent) {
        this.columnSortedSource.next(event);
    }

    columnFiltered(event: ColumnSortedEvent) {
        this.columnFilteredSource.next(event);
    }

}

export interface ColumnSortedEvent {
    sortColumn: string;
    sortDirection: string;
    sortData: any;
    filterColumn: string;
    filterValue: string;
}
