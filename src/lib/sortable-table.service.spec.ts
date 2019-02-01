import { TestBed } from '@angular/core/testing';

import { SortableTableService } from './sortable-table.service';

describe('SortableTableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SortableTableService = TestBed.get(SortableTableService);
    expect(service).toBeTruthy();
  });
});
