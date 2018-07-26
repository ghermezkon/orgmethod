import { Component, ViewChild, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators, AbstractControlDirective, AbstractControl } from "@angular/forms";
import { MatPaginator, MatSort, MatTableDataSource, MatSelect } from "@angular/material";
import { MessageService } from "../../service/message.service";
import { PersianCalendarService } from "../../service/persian.calendar.service";
import { GlobalHttpService } from "../http.service/global.http.service";
import { ActivatedRoute } from "@angular/router";
import * as _ from 'lodash';
import { SelectionModel } from "@angular/cdk/collections";
import { Department, Hoze, Ostan, City } from "../classes/index";
import { DepartmentHttpService } from "../http.service/http.dep.service";
import { FlagService } from "../../service/flag.service";
import { Observable, forkJoin } from "rxjs";
import { map, take, startWith } from "rxjs/operators";

@Component({
    selector: 'insert-branch-com',
    templateUrl: 'insert.branch.component.html',
    styleUrls: ['insert.branch.component.css']
})
export class InsertBranchComponent implements OnDestroy{
    dataForm: FormGroup;
    today: Date = new Date();
    farsiDate_short: any = null;
    farsiDate_long: any = null;
    state_save: any;
    date_message: any;
    data_list: any[] = [];
    public _mask_date = [/\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/];
    //-------------------------------------------------------------------------------
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selectedRowIndex: number = -1;
    index: number = -1;
    displayedColumns = ['select', 'branch_code', 'branch_name', 'branch_degree', 'branch_type', 'city_name'];
    dataSource = new MatTableDataSource<any>();
    //----------
    selection = new SelectionModel<any>(false, []);
    //----------
    dep_list: any[] = []
    hoze_list: any[] = []
    ostan_list: any[] = []
    city_list: any[] = [];
    khedmat_list: any[] = [];
    organ_list: any[] = [];
    branch_type_list: any[] = [];
    arz_type_list: any[] = [];
    activity_type_list: any[] = [];
    degree_list: any[] = [];
    city_list_obser: Observable<any[]>;
    dep_list_obser: Observable<any[]>;
    //-------------------------------------------------------------------------------
    constructor(private fb: FormBuilder, private _msg: MessageService,
        private persianCalendarService: PersianCalendarService,
        private _http_dep: DepartmentHttpService, private _flag: FlagService,
        private _http: GlobalHttpService, private route: ActivatedRoute) {
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
                    this.resetForm();
                    this.dep_list = org_department;
                } else {
                    this.state_save = true;
                    this.hoze_list = [];
                }
            });
        this._http.get_all_ostan().pipe(take(1)).subscribe((res: any) => {
            this.ostan_list = res;
        })
        this.dep_list_obser = this.dataForm.get('department').get('dep_name').valueChanges.pipe(
            startWith(''),
            map(val => this.filter(val))
        );
        this.khedmat_list = this._msg.getKhadamatType();
        this.organ_list = this._msg.getOrganType();
        this.branch_type_list = this._msg.getBranchType();
        this.arz_type_list = this._msg.getArzType();
        this.activity_type_list = this._msg.getActivityType();
        this.degree_list = this._msg.getDegree();
    }
    filter(val: string): string[] {
        return this.dep_list.filter(option =>
            option.dep_name.indexOf(val) === 0);
    }
    filterCity(val: string): string[] {
        return this.city_list.filter(option =>
            option.city_name.indexOf(val) === 0);
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
            branch_code: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
            branch_name: ['', Validators.required],
            branch_code_posti: ['', Validators.compose([Validators.minLength(10), Validators.pattern('[0-9]*')])],
            branch_email: [''],
            branch_address: [''],
            khadamat_type: ['', Validators.required],
            organ_type: ['', Validators.required],
            branch_type: ['', Validators.required],
            branch_degree: [''],
            arz_type: ['', Validators.required],
            activity_type: ['', Validators.required],
            main_branch_code: ['', Validators.pattern('[0-9]*')],
            dist_to_main_branch: ['', Validators.pattern('[0-9]*')],
            branch_start_date: ['', Validators.pattern('[0-9]{4}[/](0[1-9]|1[0-2])[/]([0-2]{1}[0-9]{1}|3[0-1]{1})')],
            branch_activity_date: ['', Validators.pattern('[0-9]{4}[/](0[1-9]|1[0-2])[/]([0-2]{1}[0-9]{1}|3[0-1]{1})')],
            department: this.fb.group({ ...Department }),
            hoze: this.fb.group({ ...Hoze }),
            ostan: this.fb.group({ ...Ostan }),
            city: this.fb.group({ ...City }),
            amlak:[],
            last_update_long: [''],
            last_update_short: ['']
        });
    }
    //-------------------------------------------------------------------------------
    department_select(event) {
        this._flag.set_show_branch_amlak_tab_Source(false);
        this.dataForm.reset();
        let dep = _.find(this.dep_list, { dep_name: event.option.value }, function (o) { return o; });
        this.dataForm.get('department').patchValue(dep);
        forkJoin(
            [
                this._http_dep.get_hoze_by_dep_name(event.option.value),
                this._http_dep.get_branch_by_dep_name(event.option.value)
            ]).pipe(take(1)).subscribe((res: any) => {
                if (res[0].length > 0) {
                    this.hoze_list = res[0];
                }
                if (res[0].length == 0) {
                    this.dataForm.reset();
                    this.index = -1;
                    this.selectedRowIndex = -1;
                    this.state_save = true;
                }
                if (res[1].length > 0) {

                    this.data_list = res[1];
                    this.dataSource.data = this.data_list;
                }
                if (res[1].length == 0) {
                    this.data_list = [];
                    this.dataSource.data = this.data_list;
                }
            })
    }
    hozeSelect(event) {
        if (event.value) {
            let hoze = _.find(this.hoze_list, { hoze_name: event.value }, function (o) { return o; });
            this.dataForm.get('hoze').patchValue(hoze);
        } else {
            this.dataForm.patchValue({
                hoze: this.fb.group({ ...Hoze })
            });
        }
    }
    ostanSelect(event) {
        if (event.value) {
            let ostan = _.find(this.ostan_list, { ostan_name: event.value }, function (o) { return o; });
            this.dataForm.get('ostan').patchValue(ostan);

            this._http.get_city_by_ostan_name(event.value).pipe(take(1)).subscribe((res: any) => {
                this.city_list = res;
            })
            this.city_list_obser = this.dataForm.get('city').get('city_name').valueChanges.pipe(
                startWith(''),
                map(val => this.filterCity(val))
            );
        } else {
            this.city_list = [];
        }
    }
    citySelect(event) {
        if (event.option.value) {
            let city = _.find(this.city_list, { city_name: event.option.value }, function (o) { return o; });
            this.dataForm.get('city').patchValue(city);
        }
    }
    //-------------------------------------------------------------------------------
    save_branch(data) {
        let find_index = _.findIndex(this.data_list, function (o) {
            return (o.department.dep_code == data.department.dep_code && o.branch_code == data.branch_code) ||
                (o.department.dep_code == data.department.dep_code && o.branch_name == data.branch_name);
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
            this._http_dep.save_branch(data).pipe(take(1)).subscribe((json: any) => {
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
    update_branch(data?: any) {
        let list = [...this.data_list];
        data.last_update_short = this.farsiDate_short;
        data.last_update_long = this.farsiDate_long;

        let find_index = _.findIndex(this.data_list, function (o) {
            return (o.department.dep_code == data.department.dep_code && o.branch_code == data.branch_code) ||
                (o.department.dep_code == data.department.dep_code && o.branch_name == data.branch_name);
        });
        if (find_index != -1 && find_index != this.index) {
            this.resetForm();
            this._msg.getMessage('doubleRecord');
            return;
        } else {
            this._http.update_equipment(data).pipe(take(1)).subscribe((json: any) => {
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
            //this.resetForm();
        }
    }
    //-------------------------------------------------------------------------------
    selectRow(event) {
        this.state_save = false;
        this.selectedRowIndex = event.branch_code;
        this.index = this.data_list.indexOf(event);
        this.dataForm.patchValue(event);
        this.date_message = "تاریخ ویرایش : " + this.farsiDate_long;
        this.selection.toggle(event);
        this._flag.set_show_branch_amlak_tab_Source(true);
        this._flag.set_show_branch_circle_tab_Source(true);
        this._flag.set_reset_branch_personel_table_Source(false);
        this._http_dep.setBranchSource(event);
    }
    //-------------------------------------------------------------------------------
    export() {
        this._msg.export_to_excel(this.dataSource.data, 'شعب');
    }
    //-------------------------------------------------------------------------------
    getErrorMessage(value) {
        let control: AbstractControlDirective | AbstractControl;
        control = <AbstractControl>value;
        return this._msg.getError(control.errors);
    }
    //-------------------------------------------------------------------------------
    ngOnDestroy(): void {
        this._flag.set_show_branch_amlak_tab_Source(false);
        this._flag.set_show_branch_circle_tab_Source(false);
        this.index = -1;
        this.selectedRowIndex = -1;
        this.dataSource.data = [];
        this.dataForm.reset();
    }
}