import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControlDirective, AbstractControl } from '@angular/forms';
import { MessageService } from '../../service/message.service';
import { PersianCalendarService } from '../../service/persian.calendar.service';
import { ActivatedRoute } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { GlobalHttpService } from '../http.service/global.http.service';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import 'rxjs/add/operator/take';
import { SelectionModel } from '@angular/cdk/collections';
import { DepartmentHttpService } from '../http.service/http.dep.service';
import { Department } from '../classes/index';

@Component({
    selector: 'insert-hoze-com',
    templateUrl: 'insert.hoze.component.html',
    styleUrls: ['insert.hoze.component.css']
})
export class InsertHozeComponent {
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
    displayedColumns = ['select', 'hoze_code', 'hoze_name', 'hoze_code_posti', 'hoze_email'];
    dataSource = new MatTableDataSource<any>();
    //----------
    selection = new SelectionModel<any>(false, []);
    //-------------------------------------------------------------------------------
    dep_list: any[] = []
    dep_list_obser: Observable<any[]>;
    //-------------------------------------------------------------------------------
    constructor(private fb: FormBuilder, private _msg: MessageService,
        private persianCalendarService: PersianCalendarService,
        private _http_dep: DepartmentHttpService,
        private _http: GlobalHttpService,
        private route: ActivatedRoute) {
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
            map((data) => data['org_department'])).take(1).subscribe((org_department) => {
                if (org_department.length > 0) {
                    this.resetForm();
                    this.dep_list = org_department;
                } else {
                    this.state_save = true;
                }
            });
        this.dep_list_obser = this.dataForm.get('department').get('dep_name').valueChanges.pipe(
            startWith(''),
            map(val => this.filter(val))
        );        
    }
    filter(val: string): string[] {
        return this.dep_list.filter(option =>
            option.dep_name.indexOf(val) === 0);
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
        this.selection.toggle(false);
    }
    //-------------------------------------------------------------------------------
    createForm() {
        this.dataForm = this.fb.group({
            _id: [''],
            hoze_code: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
            hoze_name: ['', Validators.required],
            hoze_code_posti: ['', Validators.compose([Validators.minLength(10), Validators.pattern('[0-9]*')])],
            hoze_email: [''],
            hoze_address: [''],
            department:this.fb.group({ ...Department }),
            last_update_long: [''],
            last_update_short: ['']
        });
    }
    //-------------------------------------------------------------------------------
    save_hoze(data) {
        let find_index = _.findIndex(this.data_list, function (o) {
            return (o.department.ostan_name == data.department.ostan_name && o.hoze_code == data.hoze_code) ||
                (o.department.hoze_name == data.department.hoze_name && o.hoze_name == data.hoze_name);
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
            this._http_dep.save_hoze(data).take(1).subscribe((json: any) => {
                if (json.result.n >= 1) {
                    this._msg.getMessage('okSave');
                    this.resetForm();
                    
                    let list = [...this.data_list];
                    list.push(json.ops[0]);
                    this.data_list = list;
                    this.dataSource.data = this.data_list;

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
    update_hoze(data?: any) {
        let list = [...this.data_list];
        data.last_update_short = this.farsiDate_short;
        data.last_update_long = this.farsiDate_long;

        let find_index = _.findIndex(this.data_list, function (o) {
            return (o.department.ostan_name == data.department.ostan_name && o.hoze_code == data.hoze_code) ||
                (o.department.hoze_name == data.department.hoze_name && o.hoze_name == data.hoze_name);
        });
        if (find_index != -1 && find_index != this.index) {
            this.resetForm();
            this._msg.getMessage('doubleRecord');
            return;
        } else {
            this._http_dep.update_hoze(data).take(1).subscribe((json: any) => {
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
    department_select(event) {
        let dep = _.find(this.dep_list, { dep_name: event.option.value }, function (o) { return o; });
        this.dataForm.get('department').patchValue(dep);

        this._http_dep.get_hoze_by_dep_name(event.option.value).take(1).subscribe((res: any) => {
            if (res.length > 0) {
                this.data_list = res;
                this.dataSource.data = this.data_list;
            }
            else {
                this.dataForm.patchValue({
                    _id: '',
                    hoze_code: '',
                    hoze_name: '',
                    hoze_code_posti: '',
                    hoze_email: '',
                    hoze_address: '',
                    department: {},                    
                });
                this.index = -1;
                this.selectedRowIndex = -1;
                this.data_list = [];
                this.dataSource.data = this.data_list;
                this.state_save = true;
            }
        });
    }
    //-------------------------------------------------------------------------------
    selectRow(event) {
        this.state_save = false;
        this.selectedRowIndex = event.hoze_code;
        this.index = this.data_list.indexOf(event);
        this.dataForm.patchValue(event);
        this.date_message = "تاریخ ویرایش : " + this.farsiDate_long;
        this.selection.toggle(event);
    }
    //-------------------------------------------------------------------------------
    export() {
        this._msg.export_to_excel(this.dataSource.data, 'حوزه ها');
    }
    //-------------------------------------------------------------------------------
    getErrorMessage(value) {
        let control: AbstractControlDirective | AbstractControl;
        control = <AbstractControl>value;
        return this._msg.getError(control.errors);
    }
}