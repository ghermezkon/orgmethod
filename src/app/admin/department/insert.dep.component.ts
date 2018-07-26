import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControlDirective, AbstractControl } from '@angular/forms';
import { MessageService } from '../../service/message.service';
import { PersianCalendarService } from '../../service/persian.calendar.service';
import { ActivatedRoute } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { DepartmentHttpService } from '../http.service/http.dep.service';
import { DepType, CircleType } from '../classes/index';
import { GlobalHttpService } from '../http.service/global.http.service';
import { FlagService } from '../../service/flag.service';
import * as _ from 'lodash';
import { SelectionModel } from '@angular/cdk/collections';
import { map, take } from 'rxjs/operators';

@Component({
    selector: 'insert-dep-com',
    templateUrl: 'insert.dep.component.html',
    styleUrls: ['insert.dep.component.css']
})
export class InsertDepartmentComponent {
    dataForm: FormGroup;
    today: Date = new Date();
    farsiDate_short: any = null;
    farsiDate_long: any = null;
    state_save: any;
    date_message: any;
    data_list: any[] = [];
    //-------------------------------------------------------------------------------
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selectedRowIndex: number = -1;
    index: number = -1;
    displayedColumns = ['select', 'dep_code', 'dep_name', 'dep_code_posti', 'deptype'];
    dataSource = new MatTableDataSource<any>();
    //----------
    selection = new SelectionModel<any>(false, []);
    //-------------------------------------------------------------------------------
    deptype_list: any[] = []
    deptype_info: any;
    //-------------------------------------------------------------------------------
    constructor(private fb: FormBuilder, private _msg: MessageService,
        private persianCalendarService: PersianCalendarService,
        private _http_dep: DepartmentHttpService,
        private _http: GlobalHttpService,
        private route: ActivatedRoute,
        private _flag: FlagService) {
        this.state_save = true;
        this.createForm();
    }
    //-------------------------------------------------------------------------------
    ngOnInit() {
        this.farsiDate_short = this.persianCalendarService.PersianCalendarShort(this.today);
        this.farsiDate_long = this.persianCalendarService.PersianCalendar(this.today);
        this.date_message = "تاریخ ذخیره سازی : " + this.farsiDate_long;
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        this.route.data.pipe(
            map((data) => data['org_department']),take(1)).subscribe((org_department) => {
                if (org_department.length > 0) {
                    this.data_list = org_department;
                    this.dataSource.data = this.data_list;
                    this.resetForm();
                } else {
                    this.state_save = true;
                }
                this._http.get_all_deptype().pipe(take(1)).subscribe((res: any) => {
                    this.deptype_list = res;
                })
            });
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
        this.dataForm.reset();
        this.state_save = true;
        this.selectedRowIndex = -1;
        this.index = -1;
        this.date_message = "تاریخ ذخیره سازی : " + this.farsiDate_long;
        this._flag.set_department_circle_Source(false);
        this.selection.toggle(false);
    }
    //-------------------------------------------------------------------------------
    createForm() {
        this.dataForm = this.fb.group({
            _id: [''],
            dep_code: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
            dep_name: ['', Validators.required],
            dep_code_posti: ['', Validators.compose([Validators.minLength(10), Validators.pattern('[0-9]*')])],
            dep_email: [''],
            dep_address: [''],
            deptype: this.fb.group({ ...DepType }),
            circlelist: [],
            last_update_long: [''],
            last_update_short: ['']
        });
    }
    //-------------------------------------------------------------------------------
    save_dep(data) {
        let find_index = _.findIndex(this.data_list, function (o) {
            return o.dep_code == data.dep_code || o.dep_name == data.dep_name;
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
            this._http_dep.save_department(data).pipe(take(1)).subscribe((json: any) => {
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
    update_dep(data?: any) {
        let list = [...this.data_list];
        data.last_update_short = this.farsiDate_short;
        data.last_update_long = this.farsiDate_long;

        let find_index = _.findIndex(this.data_list, function (o) {
            return o.dep_name == data.dep_name || o.dep_code == data.dep_code;
        });
        if (find_index != -1 && find_index != this.index) {
            this.resetForm();
            this._msg.getMessage('doubleRecord');
            return;
        } else {
            this._http_dep.update_department(data).pipe(take(1)).subscribe((json: any) => {
                if (json.nModified >= 1 || json.n >= 1) {
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
    deptype_select(event) {
        if (event.value) {
            let deptype = _.find(this.deptype_list, { deptype_name: event.value }, function (o) { return o; });
            this.dataForm.get('deptype').patchValue(deptype);
        }
    }
    //-------------------------------------------------------------------------------
    selectRow(event) {
        this.state_save = false;
        this.selectedRowIndex = event.dep_code;
        this.index = this.data_list.indexOf(event);
        this.dataForm.patchValue(event);
        this.date_message = "تاریخ ویرایش : " + this.farsiDate_long;
        this._flag.set_department_circle_Source(true);
        this._http_dep.setDepartmentSource(event);
        this.selection.toggle(event);
    }
    //-------------------------------------------------------------------------------
    export() {
        this._msg.export_to_excel(this.dataSource.data, 'ادارات');
    }
    //-------------------------------------------------------------------------------
    getErrorMessage(value) {
        let control: AbstractControlDirective | AbstractControl;
        control = <AbstractControl>value;
        return this._msg.getError(control.errors);
    }
}