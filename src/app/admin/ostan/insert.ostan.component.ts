import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControlDirective, AbstractControl } from '@angular/forms';
import { MessageService } from '../../service/message.service';
import { PersianCalendarService } from '../../service/persian.calendar.service';
import { GlobalHttpService } from '../http.service/global.http.service';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/take';
import * as _ from 'lodash';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'insert-ostan-com',
    templateUrl: 'insert.ostan.component.html',
    styleUrls: ['insert.ostan.component.css']
})
export class InsertOstanComponent {
    ostanForm: FormGroup;
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
    displayedColumns = ['select', 'ostan_code', 'ostan_name'];
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
        this.route.data.pipe(
            map((data) => data['org_ostan'])).take(1).subscribe((org_ostan) => {
                if (org_ostan.length > 0) {
                    this.data_list = org_ostan;
                    this.dataSource.data = this.data_list;
                    this.resetForm();
                } else {
                    this.state_save = true;
                }
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
        this.ostanForm.reset();
        this.state_save = true;
        this.selectedRowIndex = -1;
        this.date_message = "تاریخ ذخیره سازی : " + this.farsiDate_long;
        this.selection.toggle(false);
    }
    //-------------------------------------------------------------------------------
    createForm() {
        this.ostanForm = this.fb.group({
            _id: [''],
            ostan_code: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
            ostan_name: ['', Validators.required],
            last_update_long: [''],
            last_update_short: ['']
        });
    }
    //-------------------------------------------------------------------------------
    save_ostan(data) {
        let find_index = _.findIndex(this.data_list, function (o) {
            return o.ostan_code == data.ostan_code || o.ostan_name == data.ostan_name;
        });
        if (find_index != -1) {
            this.resetForm();
            this._msg.getMessage('doubleRecord');
            return;
        }
        else if (this.ostanForm.status == 'VALID') {
            delete data._id;
            data.last_update_short = this.farsiDate_short;
            data.last_update_long = this.farsiDate_long;
            this._http.save_ostan(data).take(1).subscribe((json: any) => {
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
    update_ostan(data?: any) {
        let list = [...this.data_list];
        data.last_update_short = this.farsiDate_short;
        data.last_update_long = this.farsiDate_long;

        let find_index = _.findIndex(this.data_list, function (o) {
            return o.ostan_name == data.ostan_name || o.ostan_code == data.ostan_code;
        });
        if (find_index != -1 && find_index != this.index) {
            this.resetForm();
            this._msg.getMessage('doubleRecord');
            return;
        } else {
            this._http.update_ostan(data).take(1).subscribe((json: any) => {
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
        this.selectedRowIndex = event.ostan_code;
        this.index = this.data_list.indexOf(event);
        this.ostanForm.patchValue(event);
        this.date_message = "تاریخ ویرایش : " + this.farsiDate_long;
        this.selection.toggle(event);
    }
    //-------------------------------------------------------------------------------
    export() {
        this._msg.export_to_excel(this.dataSource.data, 'استان ها');
    }
    //-------------------------------------------------------------------------------
    getErrorMessage(value) {
        let control: AbstractControlDirective | AbstractControl;
        control = <AbstractControl>value;
        return this._msg.getError(control.errors);
    }
}