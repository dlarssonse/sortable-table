Sortable Table
=========

A library for sorting of table data.

## Installation

  `npm install @dlarsson-se/sortable-table -S`

## StackBlitz

  [StackBlitz Example](https://stackblitz.com/edit/angular-pkhguf)

## Example Usage

#### app.module.ts

  ```
  import { SortableTableModule } from '@dlarsson-se/sortable-table;

  @NgModule({
    imports: [ SortableTableModule.forRoot() ]  
  })
  export class AppModule { }
  ```


#### app.component.html 

  ```
  <table sortableTable [sortableData]="tableData">
    <thead>
      <tr>
        <th sortableColumn="id">ID</th>
        <th sortableColumn="name">Name</th>
        <th sortableColumn="position">Position</th>
        <th sortableColumn="salary">Salary</th>
        <th sortableColumn="start_date">Start Date</th>
        <th sortableColumn="office">Office</th>
        <th sortableColumn="extn">Extension</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let data of tableData">
        <td>{{data.id}}</td>
        <td>{{data.name}}</td>
        <td>{{data.position}}</td>
        <td>{{data.salary}}</td>
        <td>{{data.start_date}}</td>
        <td>{{data.office}}</td>
        <td>{{data.extn}}</td>
      </tr>
    </tbody>
  </table>
  ```  

## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

  ```
  npm run format
  npm run lint
  ```