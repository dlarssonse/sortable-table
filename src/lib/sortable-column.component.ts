import { Component, OnInit, Input, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';

import { SortableTableService } from './sortable-table.service';

@Component({
    selector: '[sortableColumn]',
    templateUrl: './sortable-column.component.html',
    styleUrls: [ './sortable-column.component.css' ],
})
export class SortableColumnComponent implements OnInit, OnDestroy {

    constructor(private sortService: SortableTableService) { }

    @Input()
    sortableColumn: string;

    @Input()
    sortableDirection: string;

    private columnSortedSubscription: Subscription;

    @HostListener('click')
    sort() {
        this.sortableDirection = this.sortableDirection === 'asc' ? 'desc' : 'asc';
        this.sortService.columnSorted({ sortColumn: this.sortableColumn, sortDirection: this.sortableDirection, sortData: [] });
    }

    ngOnInit() {
        // subscribe to sort changes so we can react when other columns are sorted
        this.columnSortedSubscription = this.sortService.columnSorted$.subscribe(event => {
            // reset this column's sort direction to hide the sort icons
            if (this.sortableColumn !== event.sortColumn) {
                this.sortableDirection = '';
            }
        });
    }

    ngOnDestroy() {
        this.columnSortedSubscription.unsubscribe();
    }
}
