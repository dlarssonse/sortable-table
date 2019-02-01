import { NgModule, ModuleWithProviders } from '@angular/core';
import { SortableColumnComponent } from './sortable-column.component';
import { SortableTableDirective } from './sortable-table.directive';
import { SortableTableService } from './sortable-table.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [SortableTableDirective, SortableColumnComponent],
  imports: [CommonModule, BrowserModule],
  exports: [SortableTableDirective, SortableColumnComponent, CommonModule]
})
export class SortableTableModule {
  static forRoot(): ModuleWithProviders<SortableTableModule> {
    return {
      ngModule: SortableTableModule,
      providers: [ SortableTableService ],
    };
  }
 }
