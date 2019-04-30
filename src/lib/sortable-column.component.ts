import { Component, OnInit, Input, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';

import { SortableTableService } from './sortable-table.service';

@Component({
    selector: '[sortableColumn],[sortBy],[filterableColumn],[filterBy]',
    templateUrl: './sortable-column.component.html',
    styleUrls: [ './sortable-column.component.css' ],
})
export class SortableColumnComponent implements OnInit, OnDestroy {

    constructor(private sortService: SortableTableService) { }

    @Input()
    sortableColumn: string;

    @Input()
    sortBy: string;

    @Input()
    filterableColumn: string;

    @Input()
    filterBy: string;

    @Input()
    sortableDirection: string;

    @Input()
    filterValue: string;

    private columnSortedSubscription: Subscription;
    private columnFilteredSubscription: Subscription;

    @HostListener('click', ['$event.target'])
    sort(event: HTMLElement) {
        if (event.className === 'icono-filter') {
            this.sortService.columnFiltered({
                sortColumn: this.sortableColumn,
                sortDirection: '',
                filterColumn: this.filterableColumn,
                filterValue: 'London',
                sortData: []
            });
        } else {
            this.sortableDirection = this.sortableDirection === 'asc' ? 'desc' : 'asc';
            this.sortService.columnSorted({
                sortColumn: this.sortableColumn,
                sortDirection: this.sortableDirection,
                filterColumn: this.filterableColumn,
                filterValue: '',
                sortData: []
            });
        }
    }

    ngOnInit() {
        // subscribe to sort changes so we can react when other columns are sorted
        this.sortableColumn  = this.sortableColumn ? this.sortableColumn : this.sortBy;
        this.filterableColumn = this.filterableColumn ? this.filterableColumn : this.filterBy;
        this.columnSortedSubscription = this.sortService.columnSorted$.subscribe(event => {
            // reset this column's sort direction to hide the sort icons
            if (this.sortableColumn !== event.sortColumn) {
                this.sortableDirection = '';
            }
        });
        this.columnFilteredSubscription = this.sortService.columnFiltered$.subscribe(event => {
            // reset this column's sort direction to hide the sort icons
            if (this.filterableColumn !== event.filterColumn) {
                this.filterValue = '';
            }
        });
    }

    ngOnDestroy() {
        this.columnSortedSubscription.unsubscribe();
        this.columnFilteredSubscription.unsubscribe();
    }
}
