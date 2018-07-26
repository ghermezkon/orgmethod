import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,AbstractControl,AbstractControlDirective } from '@angular/forms';
import { MessageService } from '../../service/message.service';
import { PersianCalendarService } from '../../service/persian.calendar.service';
import { GlobalHttpService } from '../http.service/global.http.service';
import { ActivatedRoute } from '@angular/router';
import { map, take } from 'rxjs/operators';

@Component({
    selector: 'insert-bank-com',
    templateUrl: 'insert.bank.component.html',
})
export class InsertBankComponent {
    public _mask_date = [/\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/];
    public _mask_shomare_safhe = [/\d/, /\d/];
    //--------------------------------------------------------------------------------------------------------
    bankForm: FormGroup;
    today: Date = new Date();
    farsiDate_short: any = null;
    farsiDate_long: any = null;
    state_save: any;
    date_message: any;
    //--------------------------------------------------------------------------------------------------------
    constructor(private fb: FormBuilder, private _msg: MessageService,
        private persianCalendarService: PersianCalendarService,
        private _http: GlobalHttpService, private route: ActivatedRoute) {
        this.createForm();
    }
    //--------------------------------------------------------------------------------------------------------
    ngOnInit() {
        this.farsiDate_short = this.persianCalendarService.PersianCalendarShort(this.today);
        this.farsiDate_long = this.persianCalendarService.PersianCalendar(this.today);
        this.date_message = "تاریخ ذخیره سازی : " + this.farsiDate_long;
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        this.route.data.pipe(map((data) => data['org_bank']), take(1)).subscribe((org_bank) => {
            if (org_bank.length > 0) {
                this.bankForm.setValue(org_bank[0]);
                this.state_save = false;
                this.date_message = "تاریخ ویرایش : " + this.farsiDate_long;
            } else {
                this.state_save = true;
            }
        });
    }
    //--------------------------------------------------------------------------------------------------------
    createForm() {
        this.bankForm = this.fb.group({
            _id: [''],
            shomare_eghtesadi: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(12)])],
            shenase_meli: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10)])],
            shomare_sabt: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
            date_sabt: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{4}[/](0[1-9]|1[0-2])[/]([0-2]{1}[0-9]{1}|3[0-1]{1})')])],
            bank_name: ['', Validators.required],
            manager_name: [''],
            shomare_safhe: [],
            shomare_roznameh: [],
            date_roznameh: [''],
            shomare_nameh: [],
            date_nameh: [''],
            last_update_short: [''],
            last_update_long: ['']
        });
    }
    //--------------------------------------------------------------------------------------------------------
    resetForm() {
        this.bankForm.reset();
    }
    //--------------------------------------------------------------------------------------------------------
    save_bank(data) {
        if (this.bankForm.status == 'VALID') {
            delete data._id;
            data.last_update_short = this.farsiDate_short;
            data.last_update_long = this.farsiDate_long;
            this._http.save_bank(data).pipe(take(1)).subscribe((json: any) => {
                if (json.n >= 1) {
                    this._msg.getMessage('okSave');
                    this.state_save = false;
                    this._http.get_all_bank().subscribe((data: any) => {
                        this.bankForm.setValue(data[0]);
                        this.date_message = "تاریخ ویرایش : " + this.farsiDate_long;
                    });
                } else {
                    this._msg.getMessage('errorSave');
                    this.resetForm();
                    this.state_save = true;
                }
            });
        } else {
            this._msg.getMessage('errorSave');
            this.state_save = true;
        }
    }
    //--------------------------------------------------------------------------------------------------------
    update_bank(data?: any) {
        data.last_update_short = this.farsiDate_short;
        data.last_update_long = this.farsiDate_long;
        this._http.update_bank(data).pipe(take(1)).subscribe((json: any) => {
            if (json.nModified >= 1) {
                this._msg.getMessage('okUpdate');
                this.state_save = false;
            } else {
                this._msg.getMessage('errorUpdate');
                this.state_save = false;
            }
        });
    }
    //--------------------------------------------------------------------------------------------------------
    getErrorMessage(value) {
        let control: AbstractControlDirective | AbstractControl;
        control = <AbstractControl>value;
        return this._msg.getError(control.errors);
    }
    //--------------------------------------------------------------------------------------------------------    
} 