import { Component, ViewChild } from '@angular/core'
import { DepartmentHttpService } from '../http.service/http.dep.service';
import { FormControl, AbstractControlDirective, AbstractControl, Validators } from '@angular/forms';
import { PersianCalendarService } from '../../service/persian.calendar.service';
import { MessageService } from '../../service/message.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ConfirmDialogComponent } from '../../service/confirm.dialog';
import * as _ from 'lodash';
import { GlobalHttpService } from '../http.service/global.http.service';
import { PersonelNumber, CircleType } from '../classes/index';
import { FlagService } from '../../service/flag.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'circle-dep-com',
    templateUrl: './circle.dep.component.html',
    styleUrls: ['./circle.dep.component.css']
})
export class CircleDepartmentComponent {
    complete$: Subject<boolean> = new Subject();
    dep: any;
    today: Date = new Date();
    circletype_list: any[] = [];
    posttype_list: any[] = [];
    circletype_select: FormControl;
    posttype_select: FormControl;
    personel_number: FormControl;
    farsiDate_short: any = null;
    farsiDate_long: any = null;
    deleteButtonColor = "warn";
    //----------------------------------------------------------------------------------
    @ViewChild(MatPaginator) paginatorCircle: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selectedRowIndex: number = -1;
    index: number = -1;
    displayedColumns = ['select', 'circletype_code', 'circletype_name', 'operate'];
    displayedColumnsPost = ['posttype.posttype_code', 'posttype.posttype_name', 'personel_number', 'operate'];
    dataSourceCircle = new MatTableDataSource<any>();
    dataSourcePost = new MatTableDataSource<any>();
    //----------
    selection = new SelectionModel<any>(false, []);
    //----------------------------------------------------------------------------------
    constructor(private _http_dep: DepartmentHttpService, private _http: GlobalHttpService,
        private _msg: MessageService, private _flag: FlagService,
        private persianCalendarService: PersianCalendarService) {
        this.circletype_select = new FormControl();
        this.posttype_select = new FormControl();
        this.personel_number = new FormControl('', Validators.compose([Validators.required, Validators.pattern('[1-9]{1}[0-9]*')]));
    }
    //----------------------------------------------------------------------------------
    ngOnInit() {
        if (this._flag.get_department_circle_Source()) {
            this.selectedRowIndex = -1; this.index = -1;
            this.dataSourceCircle.data = [];
            this.dataSourcePost.data = [];
        }
        this.farsiDate_short = this.persianCalendarService.PersianCalendarShort(this.today);
        this.farsiDate_long = this.persianCalendarService.PersianCalendar(this.today);
        this._http_dep.getDepartmentSource().subscribe((res: any) => {
            this.dep = res;
            if (this.dep.circlelist) {              
                this.dataSourceCircle.data = this.dep.circlelist;
            }
            else {
                this.dep.circlelist = [];
                this.dataSourceCircle.data = [];

            }
        });
        this._http_dep.getCircleTypeSource().pipe(take(1)).subscribe((res: any) => {
            this.circletype_list = res;
        })
        this._http.get_all_posttype_by_group('both').pipe(take(1)).subscribe((res: any) => {
            this.posttype_list = res;
        })
    }
    //----------------------------------------------------------------------------------
    ngAfterViewInit() {
        this.dataSourceCircle.paginator = this.paginatorCircle;
        this.dataSourceCircle.sort = this.sort;
    }
    //----------------------------------------------------------------------------------
    addCircle(data: FormControl) {
        let find_index = _.findIndex(this.dep.circlelist, function (o) {
            return o.circletype_code == data.value.circletype_code;
        });
        if (find_index != -1) {
            this._msg.getMessage('doubleRecord');
            this.circletype_select.reset();
            return;
        } else {
            this.dep.circlelist.push(data.value);
            this.dep.last_update_short = this.farsiDate_short;
            this.dep.last_update_long = this.farsiDate_long;
            //------------------------------------------------------------------
            this._http_dep.update_department(this.dep).pipe(takeUntil(this.complete$)).subscribe((json: any) => {
                if (json.nModified >= 1) {
                    this._msg.getMessage('okUpdate');
                    this.dataSourceCircle.data = this.dep.circlelist;
                    this.circletype_select.reset();
                } else {
                    this._msg.getMessage('errorUpdate');
                }
            });
        }
    }
    deleteCirlce(event) {
        this._msg.getMessage('confirmDelete').afterClosed().pipe(takeUntil(this.complete$)).subscribe(res => {
            if (res) {
                let index = this.dep.circlelist.findIndex(d => d.circletype_code == event.circletype_code);
                this.dep.circlelist.splice(index, 1);
                this.dataSourceCircle.data = this.dep.circlelist;

                this.dep.last_update_short = this.farsiDate_short;
                this.dep.last_update_long = this.farsiDate_long;
                //------------------------------------------------------------------
                this._http_dep.update_department(this.dep).pipe(takeUntil(this.complete$)).subscribe((json: any) => {
                    if (json.nModified >= 1) {
                        this._msg.getMessage('okUpdate');
                        this.selectedRowIndex = -1;
                    } else {
                        this._msg.getMessage('errorUpdate');
                    }
                });
            }
        });
    }
    selectRow(event) {
        this.dataSourcePost.data = [];
        this.selectedRowIndex = event.circletype_code;

        if (event.personel) {
            this.dataSourcePost.data = event.personel;
        }
        this.selection.toggle(event);
    }
    addPost() {
        //---------find circletype index 
        let index = this.dep.circlelist.findIndex(o => o.circletype_code == this.selectedRowIndex)
        //---------if circle type dosent has personel ==> generate new personel array 
        if (!this.dep.circlelist[index].personel) this.dep.circlelist[index].personel = [];
        //------------find index circletype personel
        let post_index = this.dep.circlelist[index].personel.findIndex(o => o.posttype._id == this.posttype_select.value._id);

        if (post_index != -1) {//------- if this post type exist
            this._msg.getMessage('doubleRecord');
        } else {
            let personel: any[] = [{ ...PersonelNumber }];
            personel[0].posttype = this.posttype_select.value;
            personel[0].personel_number = this.personel_number.value;

            this.dep.last_update_short = this.farsiDate_short;
            this.dep.last_update_long = this.farsiDate_long;

            this.dep.circlelist[index].personel.push(personel[0]);

            this._http_dep.update_department(this.dep).pipe(takeUntil(this.complete$)).subscribe((json: any) => {
                if (json.nModified >= 1) {
                    this._msg.getMessage('okUpdate');
                    this.deleteButtonColor = "warn";
                    this.dataSourcePost.data = this.dep.circlelist[index].personel;
                } else {
                    this._msg.getMessage('errorUpdate');
                }
            });
        }
        this.posttype_select.reset();
        this.personel_number.reset();
    }
    deletePost(event) {
        this._msg.getMessage('confirmDelete').afterClosed().pipe(takeUntil(this.complete$)).subscribe(res => {
            if (res) {
                let index_circle = this.dep.circlelist.findIndex(d => d.circletype_code == this.selectedRowIndex);

                let index_post = this.dep.circlelist[index_circle].personel.findIndex(o => o.posttype == event);
                this.dep.circlelist[index_circle].personel.splice(index_post, 1);
                this.dataSourcePost.data = this.dep.circlelist[index_circle].personel;

                this.dep.last_update_short = this.farsiDate_short;
                this.dep.last_update_long = this.farsiDate_long;
                //------------------------------------------------------------------
                this._http_dep.update_department(this.dep).pipe(takeUntil(this.complete$)).subscribe((json: any) => {
                    if (json.nModified >= 1) {
                        this._msg.getMessage('okUpdate');
                    } else {
                        this._msg.getMessage('errorUpdate');
                    }
                });
            }
        });
    }
    getErrorMessage(value) {
        let control: AbstractControlDirective | AbstractControl;
        control = <AbstractControl>value;
        return this._msg.getError(control.errors);
    }
    ngOnDestroy() {
        this.complete$.next(true);
        this.complete$.complete();
    }
}