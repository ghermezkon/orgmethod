import { Component, ViewChild } from "@angular/core";
import { DepartmentHttpService } from "../http.service/http.dep.service";
import { GlobalHttpService } from "../http.service/global.http.service";
import { PersianCalendarService } from "../../service/persian.calendar.service";
import { FormControl, Validators, AbstractControlDirective, AbstractControl } from "@angular/forms";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import * as _ from 'lodash';
import { MessageService } from "../../service/message.service";
import { PersonelNumber } from "../classes/index";
import { FlagService } from "../../service/flag.service";
import { Subject } from "rxjs";
import { takeUntil, take } from "rxjs/operators";

@Component({
    selector: 'branch-circle-com',
    templateUrl: './branch.circle.component.html',
    styleUrls: ['./branch.circle.component.css']
})
export class BranchCircleComponent{
    complete$: Subject<boolean> = new Subject();
    today: Date = new Date();
    farsiDate_short: any = null;
    farsiDate_long: any = null;
    circletype_list: any[] = [];
    posttype_list: any[] = [];
    branch: any;
    date_message: any;
    flag_reset_branch_personel_table: boolean = false;
    //--------------------------------------------------------
    circletype_select: FormControl;
    posttype_select: FormControl;
    personel_number: FormControl;
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
    selection: any;
    //--------------------------------------------------------
    constructor(private _http_dep: DepartmentHttpService,
        private persianCalendarService: PersianCalendarService,
        private _msg: MessageService, private _flag: FlagService,
        private _http: GlobalHttpService) {
        this.selection = new SelectionModel<any>(false, []);
        this.circletype_select = new FormControl();
        this.posttype_select = new FormControl();
        this.personel_number = new FormControl('', Validators.compose([Validators.required, Validators.pattern('[1-9]{1}[0-9]*')]));

        this._flag.get_reset_branch_personel_table_Source().pipe(takeUntil(this.complete$)).subscribe((res: any) => {
            this.flag_reset_branch_personel_table = res;
        })                        
    }
    //--------------------------------------------------------
    ngOnInit() {
        this.farsiDate_short = this.persianCalendarService.PersianCalendarShort(this.today);
        this.farsiDate_long = this.persianCalendarService.PersianCalendar(this.today);
        this.date_message = "تاریخ ویرایش : " + this.farsiDate_long;
        //===========================================================
        this._http_dep.getCircleTypeSource().pipe(takeUntil(this.complete$)).subscribe((res: any) => {
            this.circletype_list = res;
        })
        this._http.get_all_posttype().pipe(take(1)).subscribe((res: any) => {
            this.posttype_list = res;
        })
        this._http_dep.getBranchSource().subscribe((res: any) => {
            this.branch = res;
            if (this.branch.circlelist) {
                this.dataSourceCircle.data = [...this.branch.circlelist];
            }
            else {
                this.selectedRowIndex = -1; this.index = -1;
                this.branch.circlelist = [];
                this.dataSourceCircle.data = [];
                this.dataSourcePost.data = [];
            }
        })
    }
    //--------------------------------------------------------
    ngAfterViewInit() {
        this.dataSourceCircle.paginator = this.paginatorCircle;
        this.dataSourceCircle.sort = this.sort;
    }
    //--------------------------------------------------------
    addCircle(data: FormControl) {
        let find_index = _.findIndex(this.branch.circlelist, function (o) {
            return o.circletype_code == data.value.circletype_code;
        });
        if (find_index != -1) {
            this._msg.getMessage('doubleRecord');
            this.circletype_select.reset();
            return;
        } else {
            this.branch.circlelist.push(data.value);
            this.branch.last_update_short = this.farsiDate_short;
            this.branch.last_update_long = this.farsiDate_long;
            //------------------------------------------------------------------
            this._http_dep.update_branch(this.branch).pipe(takeUntil(this.complete$)).subscribe((json: any) => {
                if (json.nModified >= 1) {
                    this._msg.getMessage('okUpdate');
                    this.dataSourceCircle.data = this.branch.circlelist;
                    this.circletype_select.reset();
                } else {
                    this._msg.getMessage('errorUpdate');
                }
            });
        }
    }
    //--------------------------------------------------------------------
    deleteCirlce(event) {
        this._msg.getMessage('confirmDelete').afterClosed().pipe(takeUntil(this.complete$)).subscribe(res => {
            if (res) {
                let index = this.branch.circlelist.findIndex(d => d.circletype_code == event.circletype_code);
                this.branch.circlelist.splice(index, 1);
                this.dataSourceCircle.data = this.branch.circlelist;

                this.branch.last_update_short = this.farsiDate_short;
                this.branch.last_update_long = this.farsiDate_long;
                //------------------------------------------------------------------
                this._http_dep.update_branch(this.branch).pipe(takeUntil(this.complete$)).subscribe((json: any) => {
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
    //--------------------------------------------------------------------
    selectRow(event) {
        this.dataSourcePost.data = [];
        this.selectedRowIndex = event.circletype_code;
        this._flag.set_reset_branch_personel_table_Source(true);
        if (event.personel) {
            this.dataSourcePost.data = event.personel;
        }
        this.selection.toggle(event);
    }
    //--------------------------------------------------------------------
    addPost() {
        //---------find circletype index 
        let index = this.branch.circlelist.findIndex(o => o.circletype_code == this.selectedRowIndex)
        //---------if circle type dosent has personel ==> generate new personel array 
        if (!this.branch.circlelist[index].personel) this.branch.circlelist[index].personel = [];
        //------------find index circletype personel
        let post_index = this.branch.circlelist[index].personel.findIndex(o => o.posttype._id == this.posttype_select.value._id);

        if (post_index != -1) {//------- if this post type exist
            this._msg.getMessage('doubleRecord');
        } else {
            let personel: any[] = [{ ...PersonelNumber }];
            personel[0].posttype = this.posttype_select.value;
            personel[0].personel_number = this.personel_number.value;

            this.branch.last_update_short = this.farsiDate_short;
            this.branch.last_update_long = this.farsiDate_long;

            this.branch.circlelist[index].personel.push(personel[0]);

            this._http_dep.update_branch(this.branch).pipe(takeUntil(this.complete$)).subscribe((json: any) => {
                if (json.nModified >= 1) {
                    this._msg.getMessage('okUpdate');
                    this.dataSourcePost.data = this.branch.circlelist[index].personel;
                } else {
                    this._msg.getMessage('errorUpdate');
                }
            });
        }
        this.posttype_select.reset();
        this.personel_number.reset();
    }
    //--------------------------------------------------------------------
    deletePost(event) {
        this._msg.getMessage('confirmDelete').afterClosed().pipe(takeUntil(this.complete$)).subscribe(res => {
            if (res) {
                let index_circle = this.branch.circlelist.findIndex(d => d.circletype_code == this.selectedRowIndex);

                let index_post = this.branch.circlelist[index_circle].personel.findIndex(o => o.posttype == event);
                this.branch.circlelist[index_circle].personel.splice(index_post, 1);
                this.dataSourcePost.data = this.branch.circlelist[index_circle].personel;

                this.branch.last_update_short = this.farsiDate_short;
                this.branch.last_update_long = this.farsiDate_long;
                //------------------------------------------------------------------
                this._http_dep.update_branch(this.branch).pipe(takeUntil(this.complete$)).subscribe((json: any) => {
                    if (json.nModified >= 1) {
                        this._msg.getMessage('okUpdate');
                    } else {
                        this._msg.getMessage('errorUpdate');
                    }
                });
            }
        });
    }
    //--------------------------------------------------------------------
    getErrorMessage(value) {
        let control: AbstractControlDirective | AbstractControl;
        control = <AbstractControl>value;
        return this._msg.getError(control.errors);
    }
    //--------------------------------------------------------------------
    ngOnDestroy(): void {
        this.index = -1;
        this.selectedRowIndex = -1;
        this.dataSourceCircle.data = [];
        this.dataSourcePost.data = [];
        this.complete$.next(true);
        this.complete$.complete();        
    }

}