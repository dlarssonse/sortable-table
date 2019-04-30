import { NgModule, ModuleWithProviders, Pipe, PipeTransform } from '@angular/core';
import { SortableColumnComponent } from './sortable-column.component';
import { SortableTableDirective } from './sortable-table.directive';
import { SortableTableService } from './sortable-table.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

/**
 * FilteredTablePipe ...
 */
@Pipe({
  name: 'filteredTable',
  pure: false
})
export class FilteredTablePipe implements PipeTransform {
  transform(items: any[]): any[] {
    if (!items) {
      return items;
    }

    return items.filter((item: any) => {
      if (item._displayed === undefined) {
        return true;
      }
      return item._displayed ? true : false;
    });
  }
}

/**
 * SortableTableModule ...
 */
@NgModule({
  declarations: [SortableTableDirective, SortableColumnComponent, FilteredTablePipe],
  imports: [CommonModule, BrowserModule],
  exports: [SortableTableDirective, SortableColumnComponent, FilteredTablePipe, CommonModule]
})
export class SortableTableModule {
  static forRoot(): ModuleWithProviders<SortableTableModule> {
    return {
      ngModule: SortableTableModule,
      providers: [ SortableTableService ],
    };
  }
 }

