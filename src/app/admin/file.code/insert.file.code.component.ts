import { Component, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, AbstractControlDirective, AbstractControl } from "@angular/forms";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { MessageService } from "../../service/message.service";
import { PersianCalendarService } from "../../service/persian.calendar.service";
import { GlobalHttpService } from "../http.service/global.http.service";
import { ActivatedRoute } from "@angular/router";
import * as _ from 'lodash';
import 'rxjs/add/operator/take';
import { map } from "rxjs/operators";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
    selector: 'insert-file-code-com',
    templateUrl: 'insert.file.code.component.html',
    styleUrls: ['insert.file.code.component.css']
})
export class InsertFileCodeComponent {
    dataForm: FormGroup;
    today: Date = new Date();
    farsiDate_short: any = null;
    farsiDate_long: any = null;
    state_save: any;
    date_message: any;
    data_list: any[] = [];
    table_list: any[] = [];
    //-------------------------------------------------------------------------------
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selectedRowIndex: number = -1;
    index: number = -1;
    displayedColumns = ['select', 'row_code', 'row_name', 'group_code'];
    dataSource = new MatTableDataSource<any>();
    //----------
    selection = new SelectionModel<any>(false, []);
    //-------------------------------------------------------------------------------
    constructor(private fb: FormBuilder, private _msg: MessageService,
        private persianCalendarService: PersianCalendarService, private _http: GlobalHttpService, private route: ActivatedRoute) {
        this.state_save = true;
        this.createForm();
    }
    //-------------------------------------------------------------------------------
    ngOnInit() {
        this.farsiDate_short = this.persianCalendarService.PersianCalendarShort(this.today);
        this.farsiDate_long = this.persianCalendarService.PersianCalendar(this.today);
        this.date_message = "تاریخ ذخیره سازی : " + this.farsiDate_long;
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        this.table_list = this._msg.getTableNumber();
    }
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
    resetForm() {
        this.dataForm.patchValue({
            row_code: [''],
            row_name: [''],
            group_code: [''],
            sumFlag : [false]
        });
        this.state_save = true;
        this.selectedRowIndex = -1;
        this.date_message = "تاریخ ذخیره سازی : " + this.farsiDate_long;
        this.selection.toggle(false);
    }
    //-------------------------------------------------------------------------------
    createForm() {
        this.dataForm = this.fb.group({
            _id: [''],
            row_code: ['', [Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(4)])]],
            row_name: ['', Validators.required],
            table_id: ['', Validators.required],
            group_code: [''],
            sum_flag: [false]
        });
    }
    //-------------------------------------------------------------------------------
    save_tablecode(data) {
        let find_index = _.findIndex(this.data_list, function (o) {
            return o.row_code == data.row_code || o.row_name == data.row_name;
        });
        if (find_index != -1) {
            this.resetForm();
            this._msg.getMessage('doubleRecord');
            return;
        }
        else if (this.dataForm.status == 'VALID') {
            delete data._id;
            data.last_update_short = this.farsiDate_short;
            data.last_update_long = this.farsiDate_long;
            data.row_code = +data.row_code;
            this._http.save_tablecode(data).take(1).subscribe((json: any) => {
                if (json.result.n >= 1) {
                    this._msg.getMessage('okSave');

                    let list = [...this.data_list];
                    list.push(json.ops[0]);
                    this.data_list = list;
                    this.dataSource.data = this.data_list;

                    this.resetForm();
                } else {
                    this._msg.getMessage('errorSave');
                    this.resetForm();
                }
            });
        } else {
            this._msg.getMessage('errorSave');
        }
    }
    //-------------------------------------------------------------------------------
    update_tablecode(data?: any) {
        let list = [...this.data_list];
        data.last_update_short = this.farsiDate_short;
        data.last_update_long = this.farsiDate_long;

        let find_index = _.findIndex(this.data_list, function (o) {
            return o.row_name == data.row_name || o.row_code == data.row_code;
        });
        if (find_index != -1 && find_index != this.index) {
            this.resetForm();
            this._msg.getMessage('doubleRecord');
            return;
        } else {
            data.row_code = +data.row_code;
            this._http.update_tablecode(data).take(1).subscribe((json: any) => {
                if (json.nModified >= 1) {
                    this._msg.getMessage('okUpdate');

                    let index = _.findIndex(this.data_list, function (o) { return o._id == data._id; });
                    list[index] = data;
                    this.data_list = list;
                    this.dataSource.data = this.data_list;
                } else {
                    this._msg.getMessage('errorUpdate');
                }
            });
            this.resetForm();
        }
    }
    //-------------------------------------------------------------------------------
    selectRow(event) {
        this.state_save = false;
        this.selectedRowIndex = event.row_code;
        this.index = this.data_list.indexOf(event);
        this.dataForm.patchValue(event);
        this.date_message = "تاریخ ویرایش : " + this.farsiDate_long;
        this.selection.toggle(event);
    }
    //-------------------------------------------------------------------------------
    tableSelect(event){
        this._http.get_all_tablecode_by_table_id(event.value).subscribe((res: any)=>{
            this.data_list = res;
            this.dataSource.data = res;
        })
    }
    export() {
        this._msg.export_to_excel(this.dataSource.data, 'جدول ردیف ها');
    }
    //-------------------------------------------------------------------------------
    getErrorMessage(value) {
        let control: AbstractControlDirective | AbstractControl;
        control = <AbstractControl>value;
        return this._msg.getError(control.errors);
    }
}