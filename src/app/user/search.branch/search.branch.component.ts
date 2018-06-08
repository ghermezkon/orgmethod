import { Component, NgModule, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared.module";
import { RouterModule, ActivatedRoute } from "@angular/router";
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import 'rxjs/add/operator/take';
import { DepartmentHttpService } from "../../admin/http.service/http.dep.service";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
    selector: 'search-branch-com',
    templateUrl: 'search.branch.component.html',
    styleUrls: ['./search.branch.component.css']
})
export class SearchBranchComponent {
    branch: any;
    @ViewChild(MatPaginator) paginatorCircle: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selectedRowIndex: number = -1;
    index: number = -1;
    displayedColumns = ['select', 'circletype_code', 'circletype_name'];
    displayedColumnsPost = ['posttype.posttype_code', 'posttype.posttype_name', 'personel_number'];
    dataSourceCircle = new MatTableDataSource<any>();
    dataSourcePost = new MatTableDataSource<any>();
    //----------
    selection: any;
    //-----------------------------------------------------------------------------------------
    constructor(private route: ActivatedRoute, private _http_dep: DepartmentHttpService) {
        this.selection = new SelectionModel<any>(false, []);
    }
    //-----------------------------------------------------------------------------------------
    ngOnInit() {
        this._http_dep.getBranchSource().subscribe((res: any)=>{
            this.branch = res[0];
            if (this.branch.circlelist) {
                this.dataSourceCircle.data = [...this.branch.circlelist];
            }
        })
    }
    //-----------------------------------------------------------------------------------------
    ngAfterViewInit() {
        this.dataSourceCircle.paginator = this.paginatorCircle;
        this.dataSourceCircle.sort = this.sort;
    }
    //-----------------------------------------------------------------------------------------
    selectRow(event) {
        this.dataSourcePost.data = [];
        this.selectedRowIndex = event.circletype_code;
        if (event.personel) {
            this.dataSourcePost.data = event.personel;
        }
        this.selection.toggle(event);
    }
}
//-----------------------------------------------------------------------------------------
@NgModule({
    declarations: [SearchBranchComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild([
            {
                path: '', component: SearchBranchComponent, pathMatch: 'full'
            },
        ])],
    providers: []
})
export class SearchBranchModule { }