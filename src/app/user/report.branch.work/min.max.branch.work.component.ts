import { Component, ViewChild } from "@angular/core";
import { FormControl, Validators, AbstractControlDirective, AbstractControl } from "@angular/forms";
import { MessageService } from "../../service/message.service";
import { BranchWorkHttpService } from "../../admin/http.service/http.branchwork.service";
import { ActivatedRoute } from "@angular/router";
import { map, take } from "rxjs/operators";
import * as _ from 'lodash';
import { GlobalHttpService } from "../../admin/http.service/global.http.service";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
    selector: 'min-max-branch-work-com',
    templateUrl: 'min.max.branch.work.component.html',
    styleUrls: ['./min.max.branch.work.component.css']
})
export class Min_MaxReportBranchWorkComponent {
    dep_code: FormControl;
    mah_date: FormControl;
    table_id: FormControl;
    group_code: FormControl;
    code_select_value: FormControl;
    min_max_select_value: FormControl;
    mah_date_list: any[] = [];
    table_list: any[] = [];
    data_list: any[] = [];
    splite_list: any[] = [];
    code_list: any[] = undefined;
    min_max: any = undefined;
    code_label: any;
    //----------------------------------------------------------------------------------------
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selectedRowIndex: number = -1;
    index: number = -1;
    displayedColumns = ['select', 'row_code', 'row_name', 'group_code'];
    dataSource = new MatTableDataSource<any>();
    selection = new SelectionModel<any>(false, []);
    //----------------------------------------------------------------------------------------
    constructor(private _msg: MessageService, private _http_branchwork: BranchWorkHttpService,
        private route: ActivatedRoute, private _http: GlobalHttpService) {
        this.dep_code = new FormControl('', Validators.compose([Validators.required, Validators.pattern('[0-9]*')]));
        this.mah_date = new FormControl('', Validators.required);
        this.table_id = new FormControl('', Validators.required);
        this.group_code = new FormControl('', Validators.required);
        this.code_select_value = new FormControl('', Validators.required);
        this.min_max_select_value = new FormControl('', Validators.required);
    }
    //----------------------------------------------------------------------------------------
    ngOnInit() {
        this.route.data.pipe(
            map((data) => data['org_mah_date']),take(1)).subscribe((org_mah_date) => {
                if (org_mah_date.length > 0) {
                    this.mah_date_list = org_mah_date;
                } else {

                }
            });
        this.table_list = this._msg.getTableNumber();
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    //----------------------------------------------------------------------------------------
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        this.dataSource.filter = filterValue;
    }
    //----------------------------------------------------------------------------------------
    dateSelect(event) {

    }
    //----------------------------------------------------------------------------------------
    tableSelect(event) {
        var self = this;
        let fldcode_data: any[] = [];
        this._http.get_all_tablecode_by_table_id(event.value).pipe(take(1)).subscribe((res: any) => {
            if (res.length > 0) {
                this.data_list = res;
                this.dataSource.data = res;
                this.code_list = undefined;
                this.code_label = null;
                this.code_select_value.reset();
                this.min_max_select_value.reset();
                this.index = -1;
            } else {
                this.data_list = [];
                this.dataSource.data = [];
                this.code_list = undefined;
            }
        })

    }
    //----------------------------------------------------------------------------------------
    showCodeSelect(event) {
        this.min_max = event.value;
        this.code_list = undefined;
        this.code_label = null;
        this.code_select_value.reset();
    }
    codeSelect(event) {
        this.code_label = this._msg.getCode(event.value);
        if (event.value == 240 || event.value == 241 || event.value == 243 ||
            event.value == 244 || event.value == 245 || event.value == 248 || event.value == 249) {
            if (this.min_max == 'min') {
                this._http_branchwork.get_min_in_month_items_branch(this.mah_date.value, this.dep_code.value, event.value).pipe(take(1)).subscribe((res: any) => {
                    if(res.length > 0) this.code_list = res[0];
                    else this.code_list = undefined;
                })
            } else {
                this._http_branchwork.get_max_in_month_items_branch(this.mah_date.value, this.dep_code.value, event.value).pipe(take(1)).subscribe((res: any) => {
                    if(res.length > 0) this.code_list = res[0];
                    else this.code_list = undefined;
                })
            }
        } else {
            if (this.min_max == 'min') {
                this._http_branchwork.get_min_in_month_items_dep(this.mah_date.value, this.dep_code.value, event.value).pipe(take(1)).subscribe((res: any) => {
                    if(res.length > 0) this.code_list = res[0];
                    else this.code_list = undefined;
                })
            } else {
                this._http_branchwork.get_max_in_month_items_dep(this.mah_date.value, this.dep_code.value, event.value).pipe(take(1)).subscribe((res: any) => {
                    if(res.length > 0) this.code_list = res[0];
                    else this.code_list = undefined;
                })
            }
        }
    }
    //----------------------------------------------------------------------------------------
    selectRow(event) {
        this.selectedRowIndex = event.row_code;
        this.index = this.data_list.indexOf(event);
        this.selection.toggle(event);
        this.splite_list = String(event.group_code).split('-');        
        this.min_max = undefined;
        this.min_max_select_value.reset();
        this.code_list = undefined;
        this.code_label = null;
    }
    //----------------------------------------------------------------------------------------
    getErrorMessage(value) {
        let control: AbstractControlDirective | AbstractControl;
        control = <AbstractControl>value;
        return this._msg.getError(control.errors);
    }
    //----------------------------------------------------------------------------------------
}