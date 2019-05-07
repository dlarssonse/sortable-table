import { Directive, OnInit, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
import { SortableTableService, ColumnSortedEvent } from './sortable-table.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[sortableTable]'
})
export class SortableTableDirective implements OnInit, OnDestroy {

  constructor(private sortService: SortableTableService) {}

    @Input()
    sortableData: any[];

    @Output()
    sorted = new EventEmitter();

    @Output()
    filtered = new EventEmitter();

    private columnSortedSubscription: Subscription;
    private columnFilteredSubscription: Subscription;

    ngOnInit() {
        // subscribe to sort changes so we emit and event for this data table
        // if there is no observers, use the default sorting function.
        this.columnSortedSubscription = this.sortService.columnSorted$.subscribe(event => {
            event.sortData = this.sortableData;
            if (this.sorted.observers.length === 0) {
                this.onSorted(event);
            } else {
                this.sorted.emit(event);
            }
        });

        // subscribe to sort changes so we emit and event for this data table
        // if there is no observers, use the default sorting function.
        this.columnFilteredSubscription = this.sortService.columnFiltered$.subscribe(event => {
            event.sortData = this.sortableData;
            if (this.filtered.observers.length === 0) {
                this.onFiltered(event);
            } else {
                this.filtered.emit(event);
            }
        });
    }

    /**
     * Default filtering function if not specific sort function is defined.
     * @param event filtering event containing column name and filter value.
     */
    onFiltered(event: ColumnSortedEvent) {
        this.sortableData.filter((a) => {
            if (event.filterColumn.indexOf('()') > 0) {
                // Sorting by function, experimental.
                const func = event.filterColumn.substr(0, event.filterColumn.indexOf('()'));
                const av = a[func]();
                a['_displayed'] = av.toLowerCase().indexOf(event.filterValue.toLowerCase()) !== -1;
                return av.toLowerCase().indexOf(event.filterValue.toLowerCase()) !== -1;
            } else if (event.filterColumn.indexOf('.') > 0) {
                // Sorting by property on element
                const sc = event.filterColumn.split('.');
                if (a[sc[0]][sc[1]] === undefined) {
                    a[sc[0]][sc[1]] = '';
                }
                if (event.filterType === 'Contains') {
                    a['_displayed'] = a[sc[0]][sc[1]].toLowerCase().indexOf(event.filterValue.toLowerCase()) !== -1;
                    return a[sc[0]][sc[1]].toLowerCase().indexOf(event.filterValue.toLowerCase()) !== -1;
                } else {
                    a['_displayed'] = a[sc[0]][sc[1]] === event.filterValue;
                    return a[sc[0]][sc[1]] === event.filterValue;
                }
            } else {
                // Sorting by property
                if (a[event.sortColumn] === undefined) {
                    a[event.sortColumn] = '';
                }
                if (event.filterType === 'Contains') {
                    a['_displayed'] = a[event.sortColumn].toLowerCase().indexOf(event.filterValue.toLowerCase()) !== -1;
                    return a[event.sortColumn].toLowerCase().indexOf(event.filterValue.toLowerCase()) !== -1;
                } else {
                    a['_displayed'] = a[event.sortColumn] === event.filterValue;
                    return a[event.sortColumn] === event.filterValue;
                }
            }
        });
    }

    /**
     * Default sorting function if not specific sort function is defined.
     * @param event sorting event containing column name and direction.
     */
    onSorted(event: ColumnSortedEvent) {
        this.sortableData.sort((a, b) => {
            if (event.sortColumn) {
                if (event.sortColumn.indexOf('()') > 0) {
                    // Sorting by function, experimental.
                    const func = event.sortColumn.substr(0, event.sortColumn.indexOf('()'));
                    const av = a[func]();
                    const bv = b[func]();
                    if (event.sortDirection === 'asc') {
                      return av < bv  ? -1 : 1;
                    } else {
                      return av > bv ? -1 : 1;
                    }
                } else if (event.sortColumn.indexOf('.') > 0) {
                    // Sorting by property on element
                    const sc = event.sortColumn.split('.');
                    if (a[sc[0]][sc[1]] === undefined) {
                        a[sc[0]][sc[1]] = '';
                    }
                    if (b[sc[0]][sc[1]] === undefined) {
                        b[sc[0]][sc[1]] = '';
                    }
                    if (event.sortDirection === 'asc') {
                        return a[sc[0]][sc[1]] < b[sc[0]][sc[1]]  ? -1 : 1;
                    } else {
                        return a[sc[0]][sc[1]] > b[sc[0]][sc[1]]  ? -1 : 1;
                    }
                } else {
                    // Sorting by property
                    if (a[event.sortColumn] === undefined) {
                        a[event.sortColumn] = '';
                    }
                    if (b[event.sortColumn] === undefined) {
                        b[event.sortColumn] = '';
                    }
                    if (event.sortDirection === 'asc') {
                        return a[event.sortColumn] < b[event.sortColumn]  ? -1 : 1;
                    } else {
                        return a[event.sortColumn] > b[event.sortColumn]  ? -1 : 1;
                    }
                }
            }
        });
    }

    /**
     * Unsubscribe to all when destroing.
     */
    ngOnDestroy() {
        this.columnSortedSubscription.unsubscribe();
        this.columnFilteredSubscription.unsubscribe();
    }

}
