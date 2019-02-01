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

    private columnSortedSubscription: Subscription;

    ngOnInit() {
        // subscribe to sort changes so we emit and event for this data table
        // if there is no observers, use the default sorting function.
        this.columnSortedSubscription = this.sortService.columnSorted$.subscribe(event => {
            if (this.sorted.observers.length === 0) {
                this.onSorted(event);
            } else {
                this.sorted.emit(event);
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
                if (event.sortColumn.indexOf('.') > 0) {
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
    }

}
