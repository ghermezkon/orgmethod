import { Component, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, AbstractControlDirective, AbstractControl } from "@angular/forms";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { MessageService } from "../../service/message.service";
import { PersianCalendarService } from "../../service/persian.calendar.service";
import { GlobalHttpService } from "../http.service/global.http.service";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
import 'rxjs/add/operator/take';
import * as _ from 'lodash';
import { SelectionModel } from "@angular/cdk/collections";

@Component({
    selector: 'insert-post-type-com',
    templateUrl: 'insert.post.type.component.html',
    styleUrls: ['insert.post.type.component.css']
})
export class InsertPostTypeComponent {
    dataForm: FormGroup;
    today: Date = new Date();
    farsiDate_short: any = null;
    farsiDate_long: any = null;
    state_save: any;
    date_message: any;
    post_group: any[] = [];
    data_list: any[] = [];
    //-------------------------------------------------------------------------------
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selectedRowIndex: number = -1;
    index: number = -1;
    displayedColumns = ['select', 'posttype_code', 'posttype_name'];
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
            map((data) => data['org_posttype'])).take(1).subscribe((org_posttype) => {
                if (org_posttype.length > 0) {
                    this.data_list = org_posttype;
                    this.dataSource.data = this.data_list;
                    this.resetForm();
                } else {
                    this.state_save = true;
                }
            });
        this.post_group = this._msg.getPostGroup();
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
        this.date_message = "تاریخ ذخیره سازی : " + this.farsiDate_long;
        this.selection.toggle(false);
    }
    //-------------------------------------------------------------------------------
    createForm() {
        this.dataForm = this.fb.group({
            _id: [''],
            posttype_code: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
            posttype_name: ['', Validators.required],
            posttype_group: ['', Validators.required],
            last_update_long: [''],
            last_update_short: ['']
        });
    }
    //-------------------------------------------------------------------------------
    save_posttype(data) {
        let find_index = _.findIndex(this.data_list, function (o) {
            return o.posttype_code == data.posttype_code || o.posttype_name == data.posttype_name;
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
            this._http.save_posttype(data).take(1).subscribe((json: any) => {
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
    update_posttype(data?: any) {
        let list = [...this.data_list];
        data.last_update_short = this.farsiDate_short;
        data.last_update_long = this.farsiDate_long;

        let find_index = _.findIndex(this.data_list, function (o) {
            return o.posttype_name == data.posttype_name || o.posttype_code == data.posttype_code;
        });
        if (find_index != -1 && find_index != this.index) {
            this.resetForm();
            this._msg.getMessage('doubleRecord');
            return;
        } else {
            this._http.update_posttype(data).take(1).subscribe((json: any) => {
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
        this.selectedRowIndex = event.posttype_code;
        this.index = this.data_list.indexOf(event);
        this.dataForm.patchValue(event);
        this.date_message = "تاریخ ویرایش : " + this.farsiDate_long;
        this.selection.toggle(event);
    }
    //-------------------------------------------------------------------------------
    export() {
        this._msg.export_to_excel(this.dataSource.data, 'انواع مشاغل سازمانی');
    }
    //-------------------------------------------------------------------------------
    getErrorMessage(value) {
        let control: AbstractControlDirective | AbstractControl;
        control = <AbstractControl>value;
        return this._msg.getError(control.errors);
    }
}