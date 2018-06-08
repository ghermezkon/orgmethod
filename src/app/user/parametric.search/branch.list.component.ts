import { Component, NgModule, ViewChild } from "@angular/core";
import { DepartmentHttpService } from "../../admin/http.service/http.dep.service";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared.module";
import { RouterModule } from "@angular/router";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
    templateUrl: 'branch.list.component.html',
    styleUrls: ['branch.list.component.css']
})
export class BranchListComponent {
    branch_list: any[] = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selectedRowIndex: number = -1;
    index: number = -1;
    displayedColumns = ['branch_code', 'branch_name', 'branch_degree', 'branch_type', 'ostan_name','city_name'];
    dataSource = new MatTableDataSource<any>();
    //----------
    selection = new SelectionModel<any>(false, []);
    //-------------------------------------------------------------------------------
    constructor(private _http_dep: DepartmentHttpService) {
        this._http_dep.getBranchSource().subscribe((res: any) => {
            console.log(res);
            this.dataSource.data = res;
        })
    }
    ngOnInit() { }
    //-------------------------------------------------------------------------------
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    //-------------------------------------------------------------------------------
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        this.dataSource.filter = filterValue;
    }    
    //-------------------------------------------------------------------------------
}
@NgModule({
    declarations: [BranchListComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild([
            {
                path: '', component: BranchListComponent, pathMatch: 'full'
            },
        ])],
    providers: []
})
export class BranchListModule { }