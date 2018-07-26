import { Component, ViewChild } from '@angular/core'
import { FormGroup, FormControl, FormBuilder, AbstractControlDirective, AbstractControl, Validators } from '@angular/forms';
import { MessageService } from '../../service/message.service';

import { BehaviorSubject, Observable } from 'rxjs';
import { PersianCalendarService } from '../../service/persian.calendar.service';
import { GlobalHttpService } from '../http.service/global.http.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { Ostan } from '../classes/index';
import { SelectionModel } from '@angular/cdk/collections';

import * as _ from 'lodash';
import { map, take, startWith } from 'rxjs/operators';

@Component({
    selector: 'insert-city-com',
    templateUrl: 'insert.city.component.html',
    styleUrls: ['insert.city.component.css']
})
export class InsertCityComponent {
    //-------------------------------------------------------------------------
    cityForm: FormGroup;
    today: Date = new Date();
    farsiDate_short: any = null;
    farsiDate_long: any = null;
    state_save: any;
    date_message: any;
    data_list: any[] = [];
    //-------------------------------------------------------------------------
    ostan_list: any[] = []
    ostan_list_observ: Observable<any[]>;
    city_type_list: any[] = [];
    ostan_info: any;
    //-------------------------------------------------------------------------
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selectedRowIndex: number = -1;
    index: number = -1;
    displayedColumns = ['select','city_code', 'city_name', 'country_code', 'city_type'];
    dataSource = new MatTableDataSource<any>();
    //----------
    selection = new SelectionModel<any>(false, []);        
    //-------------------------------------------------------------------------
    constructor(private fb: FormBuilder, private _msg: MessageService,
        private persianCalendarService: PersianCalendarService,
        private _http: GlobalHttpService, private route: ActivatedRoute) {
        this.state_save = true;
        this.createForm();
    }
    //-------------------------------------------------------------------------
    ngOnInit() {
        this.farsiDate_short = this.persianCalendarService.PersianCalendarShort(this.today);
        this.farsiDate_long = this.persianCalendarService.PersianCalendar(this.today);
        this.date_message = "تاریخ ذخیره سازی : " + this.farsiDate_long;
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        this.route.data.pipe(
            map((data) => data['org_ostan'])).pipe(take(1)).subscribe((org_ostan) => {
                if (org_ostan.length > 0) {
                    this.ostan_list = org_ostan;
                }
            });
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        this.ostan_list_observ = this.cityForm.get('ostan').get('ostan_name').valueChanges.pipe(
            startWith(''),
            map(val => this.filter(val))
        );
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        this.city_type_list = this._msg.getCityType();
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        this.dataSource.filter = filterValue;
    }
    //-------------------------------------------------------------------------
    createForm() {
        this.cityForm = this.fb.group({
            _id: [''],
            city_code: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
            city_name: ['', Validators.required],
            country_code: ['', Validators.pattern('[0-9]*')],
            city_type: [],
            markaz_ostan: [false],
            markaz_city: [false],
            ostan: this.fb.group({ ...Ostan }),
            last_update_long: [''],
            last_update_short: ['']
        })
    }
    //-------------------------------------------------------------------------    
    resetForm() {
        this.cityForm.reset();
        this.selectedRowIndex = -1;
        this.state_save = true;
        this.date_message = "تاریخ ذخیره سازی : " + this.farsiDate_long;
        this.data_list = [];
        this.dataSource.data = [];
        this.selection.toggle(false);
    }
    //-------------------------------------------------------------------------
    filter(val: string): string[] {
        return this.ostan_list.filter(option =>
            option.ostan_name.indexOf(val) === 0);
    }
    //-------------------------------------------------------------------------
    save_city(data) {
        let find_index = _.findIndex(this.data_list, function (o) {
            return (o.ostan.ostan_name == data.ostan.ostan_name && o.city_code == data.city_code) ||
                (o.ostan.ostan_name == data.ostan.ostan_name && o.city_name == data.city_name);
        });
        if (find_index != -1) {
            this.resetForm();
            this._msg.getMessage('doubleRecord');
            return;
        }
        else if (this.cityForm.status == 'VALID') {
            delete data._id;
            data.last_update_short = this.farsiDate_short;
            data.last_update_long = this.farsiDate_long;
            this._http.save_city(data).pipe(take(1)).subscribe((json: any) => {
                if (json.result.n >= 1) {
                    this._msg.getMessage('okSave');

                    let list = [...this.data_list];
                    list.push(json.ops[0]);
                    this.data_list = list;
                    this.dataSource.data = this.data_list;

                    this.cityForm.patchValue({
                        city_code: '',
                        city_name: '',
                        country_code: '',
                        city_type: '',
                        markaz_ostan: false,
                        markaz_city: false,
                    });
                    this.state_save = true;

                } else {
                    this._msg.getMessage('errorSave');
                    this.resetForm();
                }
            });
        } else {
            this._msg.getMessage('errorSave');
        }
    }
    //-------------------------------------------------------------------------
    update_city(data?: any) {
        let list = [...this.data_list];
        data.last_update_short = this.farsiDate_short;
        data.last_update_long = this.farsiDate_long;
        let find_index = _.findIndex(this.data_list, function (o) {
            return (o.ostan.ostan_name == data.ostan.ostan_name && o.city_code == data.city_code) ||
                (o.ostan.ostan_name == data.ostan.ostan_name && o.city_name == data.city_name);
        });
        if (find_index != -1 && find_index != this.index) {
            this.resetForm();
            this._msg.getMessage('doubleRecord');
            return;
        } else {
            this._http.update_city(data).pipe(take(1)).subscribe((json: any) => {
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
        }
    }
    //-------------------------------------------------------------------------
    selectRow(event) {
        this.state_save = false;
        this.selectedRowIndex = event.city_code;
        this.index = this.data_list.indexOf(event);

        this.cityForm.patchValue(event);
        this.date_message = "تاریخ ویرایش : " + this.farsiDate_long;
        this.selection.toggle(event);
    }
    //-------------------------------------------------------------------------
    ostan_select(event) {
        let ostan = _.find(this.ostan_list, { ostan_name: event.option.value }, function (o) { return o; });
        this.cityForm.get('ostan').patchValue(ostan);

        this._http.get_city_by_ostan_name(event.option.value).subscribe((res: any) => {
            if (res.length > 0) {
                this.data_list = res;
                this.dataSource.data = this.data_list;
            }
            else {
                this.cityForm.patchValue({
                    _id: '',
                    city_code: '',
                    city_name: '',
                    country_code: '',
                    city_type: '',
                    ostan: {},
                    markaz_ostan: false,
                    markaz_city: false,
                });
                this.index = -1;
                this.selectedRowIndex = -1;
                this.data_list = [];
                this.dataSource.data = this.data_list;
                this.state_save = true;
            }
        });
    }
    //-------------------------------------------------------------------------
    export() {
        this._msg.export_to_excel(this.dataSource.data, 'شهر ها');
    }
    //-------------------------------------------------------------------------
    getErrorMessage(value) {
        let control: AbstractControlDirective | AbstractControl;
        control = <AbstractControl>value;
        return this._msg.getError(control.errors);
    }
}