import { Component, ViewChild } from "@angular/core";
import { MessageService } from "../../service/message.service";
import { PersianCalendarService } from "../../service/persian.calendar.service";
import { GlobalHttpService } from "../http.service/global.http.service";
import { ActivatedRoute } from "@angular/router";
import { BranchWorkHttpService } from "../http.service/http.branchwork.service";
import { DepartmentHttpService } from "../http.service/http.dep.service";
import { FormControl, Validators, AbstractControlDirective, AbstractControl } from "@angular/forms";

import { map, take } from "rxjs/operators";
import * as _ from 'lodash';
import * as xlsx from 'xlsx';
import { forkJoin } from "rxjs";

export class MahFile {
    public fldcode: number;
    public amount: number;
    constructor(fldcode, amount) {
        this.fldcode = fldcode;
        this.amount = amount;
    }
}
const doc = {
    dep_code: '',
    items: [],
    mah_date: 0
}
@Component({
    selector: 'insert-file-define-com',
    templateUrl: 'insert.file.define.component.html',
    styleUrls: ['insert.file.define.component.css']
})
export class InsertFileDefineComponent {
    today: Date = new Date();
    farsiDate_short: any = null;
    farsiDate_long: any = null;
    state_save: any;
    date_message: any;
    main_file: any;
    file_data: _.Dictionary<any[]>;
    branchwork_list: any[] = [];
    dep_code: FormControl;
    create_button_text: string;
    mah_date: any = null;
    mah_date_int: number = null;
    department: any = null;
    create_document: boolean = false;
    new_file: any;
    flagInputFile: boolean = false;
    flagUpdateFile: boolean = false;
    show_progress: boolean = false;
    //-----------------------------------------
    branch_data: any;
    fldcode_data: any;
    //-------------------------------------------------------------------------------
    constructor(private _msg: MessageService, private _http_branchwork: BranchWorkHttpService, private _http_dep: DepartmentHttpService,
        private persianCalendarService: PersianCalendarService, private _http: GlobalHttpService, private route: ActivatedRoute) {
        this.state_save = true;
        this.dep_code = new FormControl('', Validators.compose([Validators.required, Validators.pattern('[0-9]*')]));
    }
    //-------------------------------------------------------------------------------
    ngOnInit() {
        this._http.get_current_date().pipe(take(1)).subscribe((res: any) => {
            this.mah_date = this.persianCalendarService.PersianCalendarShort(new Date(res));
        })
    }
    fileOnChange(event: EventTarget) {
        let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
        let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
        let files: FileList = target.files;
        this.new_file = files[0];
        if (this.new_file && this.new_file.name != null){
            this.show_progress = false;
            this.flagUpdateFile = false;
            this.flagInputFile = true;
        }
        else
            this.flagInputFile = false;
    }
    check_department(event) {
        if (event.keyCode == 13 || event.keyCode == 9) {
            let mah_date_int: number;
            mah_date_int = this.mah_date_int = parseInt(String(this.mah_date).substr(0, 6));
            if (this.dep_code.valid) {
                this._http_dep.get_by_dep_code(this.dep_code.value.trim()).pipe(take(1)).subscribe((res: any) => {
                    if (res.length > 0) {
                        this.department = res[0];
                        this._http_branchwork.get_current_branchwork(this.mah_date_int, this.dep_code.value).pipe(take(1)).subscribe((res: any) => {
                            if (res.length > 0) {
                                this.branchwork_list = res[0];
                                this.create_document = false;
                            } else {
                                this.create_button_text = 'ایجاد فایل آمار ماهانه به تاریخ ' + this.mah_date_int;
                                this.create_document = true;
                            }
                        })
                    }
                    else {
                        this.department = null;
                        this.create_document = false;
                    }
                })
            }
        }
    }
    create_new_document() {
        let branch_list = [];

        let new_document = { ...doc };
        this._http_dep.get_branch_by_dep_code(this.dep_code.value).pipe(take(1)).subscribe((res: any) => {
            new_document.dep_code = this.dep_code.value;
            _.each(res, (o) => {
                let mahFile_arr = [];
                let mahFile_dep = [];
                //--------------------------------
                let mahFile = new MahFile(240, 0);
                mahFile_arr.push(mahFile);
                mahFile = new MahFile(241, 0);
                mahFile_arr.push(mahFile);
                mahFile = new MahFile(243, 0);
                mahFile_arr.push(mahFile);
                mahFile = new MahFile(244, 0);
                mahFile_arr.push(mahFile);
                mahFile = new MahFile(245, 0);
                mahFile_arr.push(mahFile);
                mahFile = new MahFile(248, 0);
                mahFile_arr.push(mahFile);
                mahFile = new MahFile(249, 0);
                mahFile_arr.push(mahFile);
                for (let i = 1; i < 500; i++) {
                    if (i == 240 || i == 241 || i == 243 || i == 244 || i == 245 || i == 248 || i == 249) continue;
                    else {
                        mahFile = new MahFile(i, 0);
                        mahFile_dep.push(mahFile);
                    }
                }
                //--------------------------------
                new_document.items.push({ branch_code: o.branch_code, branch_name: o.branch_name, items_branch: [...mahFile_arr], items_dep: [...mahFile_dep] });
            })
            new_document.mah_date = this.mah_date_int;

            this._http_branchwork.save_branchwork_all(new_document).pipe(take(1)).subscribe((res: any) => {
                if (res.result.n >= 1) {
                    this.branchwork_list = res.ops[0];
                    this._msg.getMessage('okSave');
                    this.create_document = false;
                } else {
                    this._msg.getMessage('errorSave');
                    this.dep_code.reset();
                }
            })
        })
    }
    //-------------------------------------------------------------------------------
    load_file() {
        var true_data: any;
        var reader = new FileReader(), fileData;
        let workbook: any;
        var self = this;
        this.show_progress = true;
        reader.onload = (e) => {
            var workbook = xlsx.read(reader.result, { type: 'binary' });
            if (workbook.SheetNames.length <= 1) {
                workbook.SheetNames.forEach(function (sheetName) {
                    self.main_file = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
                    self.flagUpdateFile = true;
                })
            } else {
                this.flagUpdateFile = false;
                this._msg.getMessage('fileError');
            }
        };
        reader.onloadend = (e1)=>{
            this.show_progress = false;
        }
        if (this.new_file && this.new_file.name != null) {
            this.flagInputFile = true;
            this.flagUpdateFile = false;
            reader.readAsBinaryString(this.new_file);
        }
        else {
            this.flagUpdateFile = false;
            this.flagInputFile = false;
        }
    }
    //-------------------------------------------------------------------------------
    save_file() {
        var year = this.main_file[0]['year'];
        if (this.main_file != null) {
            this.file_data = this.groupByBranchId(this.main_file);
            var self = this;
            var result = _.chain(this.file_data).map((value, key) => ({ branchId: key, items: value })).value();

            _.each(result, (o) => {
                let branch = _.filter(_.pick(this.branchwork_list, 'items').items, (b) => {
                    return b.branch_code == +o.branchId;
                })
                if (branch.length > 0) {
                    let mahFile_arr = [];
                    _.each(o.items, (oi) => {
                        let mahFile = new MahFile(+oi.FLDCODE, +oi.AMOUNT);
                        mahFile_arr.push(mahFile)
                    })
                    branch[0].items_dep = [...mahFile_arr];
                    let branch_index = _.findIndex(_.pick(self.branchwork_list, 'items').items, (p) => {
                        return p.branch_code == branch[0].branch_code
                    });

                    self.branchwork_list['items'][branch_index] = branch[0];
                }
            })
            this._http_branchwork.update_branchwork_all(this.branchwork_list).pipe(take(1)).subscribe((res: any) => {
                if (res.nModified >= 1) {
                    this._msg.getMessage('okSave');
                } else {
                    this._msg.getMessage('errorUpdate');
                }
            })
        }
    }
    //-------------------------------------------------------------------------------
    groupByBranchId(data: any[]) {
        var result = _.groupBy(data, 'UCODE');
        return result;
    }
    //-------------------------------------------------------------------------------
    getTable() {
        forkJoin([this._http_branchwork.get_current_branchwork(this.mah_date_int, this.dep_code.value), 
            this._http.get_all_tablecode_by_table_id('جدول 1')]).subscribe(res => {
            this.branchwork_list = res[0][0];
            let branch = _.find(_.pick(this.branchwork_list, 'items').items, (p) => {
                return p.branch_code == 6502
            });
            this.fldcode_data = res[1];
            for (var i = 0; i < this.fldcode_data.length; i++) {
                this.fldcode_data[i].itemList = this.fldcode_data[i].group_code.split('-');
            }

            let all_field = _.concat(branch.items_dep, branch.items_branch);

            for (var i = 0; i < this.fldcode_data.length; i++) {
                for (var j = 0; j < this.fldcode_data[i].itemList.length; j++) {
                    var findValue = _.find(all_field, (o) => {
                        return o.fldcode == this.fldcode_data[i].itemList[j]
                    })

                    if (findValue)
                        this.fldcode_data[i].itemList[j] = findValue.amount;
                    else
                        this.fldcode_data[i].itemList[j] = 0;
                }
            }
        });
    }
    //-------------------------------------------------------------------------------
    getErrorMessage(value) {
        let control: AbstractControlDirective | AbstractControl;
        control = <AbstractControl>value;
        return this._msg.getError(control.errors);
    }
    //-------------------------------------------------------------------------------
}