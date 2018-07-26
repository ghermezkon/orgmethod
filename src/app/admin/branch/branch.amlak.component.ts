import { Component } from '@angular/core'
import { FormGroup, FormBuilder, Validators, AbstractControlDirective, AbstractControl } from '@angular/forms';
import { MessageService } from '../../service/message.service';
import { DepartmentHttpService } from '../http.service/http.dep.service';
import { PersianCalendarService } from '../../service/persian.calendar.service';
import { melkType } from '../classes/index';
import { FlagService } from '../../service/flag.service';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'branch-amlak-com',
    templateUrl: './branch.amlak.component.html'
})
export class BranchAmlakComponent {
    complete$: Subject<boolean> = new Subject();
    melkForm: FormGroup;
    branch: any;
    date_message: any;
    today: Date = new Date();
    farsiDate_short: any = null;
    farsiDate_long: any = null;
    melk_type_list: any[] = [];
    //-------------------------------------------------------------------------
    constructor(private fb: FormBuilder, private _msg: MessageService,
        private persianCalendarService: PersianCalendarService, private _flag: FlagService,
        private _http_dep: DepartmentHttpService) { }
    ngOnInit() {
        this.farsiDate_short = this.persianCalendarService.PersianCalendarShort(this.today);
        this.farsiDate_long = this.persianCalendarService.PersianCalendar(this.today);
        this.date_message = "تاریخ ویرایش : " + this.farsiDate_long;
        //==========================================================        
        this.createForm();
        //==========================================================
        this.melk_type_list = this._msg.getMelkType();
        this._http_dep.getBranchSource().pipe(takeUntil(this.complete$)).subscribe((res: any) => {
            this.branch = res;
            if (this.branch.amlak) {
                this.melkForm.patchValue(res.amlak);
            } else {
                this.melkForm.reset();
            }
        })
        //==========================================================
    }
    createForm() {
        this.melkForm = this.fb.group({
            melk_type: this.fb.group({ ...melkType }),
            aztaraf: [''],
            moghofe: [''],
            masahat: ['', Validators.pattern('[0-9]*')],
            zirbana: ['', Validators.pattern('[0-9]*')],
            floor_number: ['', Validators.pattern('[0-9]*')],
            khazane_boton: [false],
            khazane_boton_full: [false],
            soldier: [false],
            camera: [false],
            loud_system: [false],
            sandogh_amanat: [false],
            sandogh_big: ['', Validators.pattern('[0-9]*')],
            sandogh_middle: ['', Validators.pattern('[0-9]*')],
            sandogh_small: ['', Validators.pattern('[0-9]*')]
        });
    }
    //-------------------------------------------------------------------------
    melkTypeSelect(event) {
        let melkType = _.find(this.melk_type_list, { name: event.value }, function (o) { return o; });
        this.melkForm.get('melk_type').patchValue(melkType);
    }
    //-------------------------------------------------------------------------
    update_branch(data) {
        this.branch.amlak = this.melkForm.value;
        this.branch.last_update_short = this.farsiDate_short;
        this.branch.last_update_long = this.farsiDate_long;
        this._http_dep.update_branch(this.branch).pipe(takeUntil(this.complete$)).subscribe((json: any) => {
            if (json.nModified >= 1) {
                this._msg.getMessage('okUpdate');
            } else {
                this._msg.getMessage('errorUpdate');
            }
        });
    }
    //-------------------------------------------------------------------------
    getErrorMessage(value) {
        let control: AbstractControlDirective | AbstractControl;
        control = <AbstractControl>value;
        return this._msg.getError(control.errors);
    }
    //-------------------------------------------------------------------------
    ngOnDestroy() {
        this.complete$.next(true);
        this.complete$.complete();
    }
}