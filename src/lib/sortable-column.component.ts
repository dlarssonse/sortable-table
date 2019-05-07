import { Component, OnInit, Input, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
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

    @ViewChild('filterDiv') filterDiv: ElementRef;
    @ViewChild('filterInput') filterInput: ElementRef;
    @ViewChild('filterIcon') filterIcon: ElementRef;
    @ViewChild('filterIconFiltered') filterIconFiltered: ElementRef;

    private filterShown: boolean;
    private columnSortedSubscription: Subscription;
    private columnFilteredSubscription: Subscription;

    @HostListener('click', ['$event'])
    sort(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (target.className.indexOf('st-filter') >= 0) {
            // console.log('do nothing');
        } else if (target.className.indexOf('st-icon') >= 0) {
            if (!this.filterShown) {
                this.reposition(true);
            } else {
                this.filterDiv.nativeElement.setAttribute('style', 'display: none; left: ' + (event.pageX - 5) +
                    'px; top: ' + (event.pageY + 10) + 'px');
            }
            this.filterShown = !this.filterShown;
        } else {
            this.sortableDirection = this.sortableDirection === 'asc' ? 'desc' : 'asc';
            this.sortService.columnSorted({
                sortColumn: this.sortableColumn,
                sortDirection: this.sortableDirection,
                filterColumn: this.filterableColumn,
                filterValue: '',
                filterType: '',
                sortData: []
            });
        }
    }

    /**
     * filterBlur ...
     */
    filterBlur(): void {
        this.filterDiv.nativeElement.setAttribute('style', 'display: none;');
        this.filterShown = false;
    }

    /**
     * filterChange ...
     */
    filterChange(event: Event): void {
        this.filterValue = (event.target as HTMLInputElement).value ? (event.target as HTMLInputElement).value : '';
        this.sortService.columnFiltered({
            sortColumn: this.sortableColumn,
            sortDirection: '',
            filterColumn: this.filterableColumn,
            filterValue: this.filterValue,
            filterType: 'Contains',
            sortData: []
        });

        this.reposition();
    }

    /**
     * reposition moves the filter div to where the filter button is.
     * @input focus should the input field be autofocused after resposition?
     */
    reposition(focus?: boolean): void {
        // Reposition filter box
        setTimeout(() => {
            if (this.filterIconFiltered) {
                this.filterDiv.nativeElement.setAttribute('style', 'display: inline; left: ' +
                    (this.filterIconFiltered.nativeElement.offsetLeft - 5) + 'px; top: ' +
                    (this.filterIconFiltered.nativeElement.offsetTop + 10) + 'px');
            } else if (this.filterIcon) {
                this.filterDiv.nativeElement.setAttribute('style', 'display: inline; left: ' +
                    (this.filterIcon.nativeElement.offsetLeft - 5) + 'px; top: ' +
                    (this.filterIcon.nativeElement.offsetTop + 10) + 'px');
            }
            if (focus) {
                this.filterInput.nativeElement.focus();
            }
        }, 10);
    }

    /**
     * ngOnInit ...
     */
    ngOnInit() {
        // subscribe to sort changes so we can react when other columns are sorted
        this.filterValue = '';
        this.filterShown = false;
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

    /**
     * ngOnDestroy ...
     */
    ngOnDestroy() {
        this.columnSortedSubscription.unsubscribe();
        this.columnFilteredSubscription.unsubscribe();
    }
}
