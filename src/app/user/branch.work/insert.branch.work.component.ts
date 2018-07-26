import { Component, ViewChild, ElementRef, Renderer2 } from "@angular/core";
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControlDirective, AbstractControl } from "@angular/forms";
import { MessageService } from "../../service/message.service";
import { PersianCalendarService } from "../../service/persian.calendar.service";
import { DepartmentHttpService } from "../../admin/http.service/http.dep.service";
import { ActivatedRoute } from "@angular/router";
import { FlagService } from "../../service/flag.service";
import { GlobalHttpService } from "../../admin/http.service/global.http.service";
import { BranchWorkHttpService } from "../../admin/http.service/http.branchwork.service";
import { MatInput } from "@angular/material";
import * as _ from 'lodash';
import { PagerService } from "../../service/pager.service";
import { take } from "rxjs/operators";
//--------------------------------------------------------
export class MahFile {
    public fldcode: number;
    public amount: number;
    constructor(fldcode, amount) {
        this.fldcode = fldcode;
        this.amount = amount;
    }
}
//--------------------------------------------------------
const document = {
    dep_code: '',
    items: [],
    mah_date: 0
}
//--------------------------------------------------------
@Component({
    selector: 'insert-branch-work-com',
    templateUrl: './insert.branch.work.component.html'
})
export class InsertBranchWorkComponent {
    dep_code: FormControl;
    dataForm: FormGroup;
    mah_date: any = null;
    mah_date_int: number = null;
    create_document: boolean = false;
    date_message: any;
    branchwork_list: any[] = [];
    department: any = null;
    branch_name: any;
    create_button_text: string;
    // pager object
    pager: any = {};

    // paged items
    pagedItems: any[];
    //--------------------------------------------------------
    @ViewChild('branchCode') branchCode: ElementRef;
    //--------------------------------------------------------
    constructor(private fb: FormBuilder, private _msg: MessageService,
        private persianCalendarService: PersianCalendarService, private _http: GlobalHttpService,
        private _http_branchwork: BranchWorkHttpService, private pagerService: PagerService,
        private _http_dep: DepartmentHttpService, private _flag: FlagService,
        private route: ActivatedRoute, private render: Renderer2) {
        this.createForm();
    }
    //--------------------------------------------------------
    createForm() {
        this.dataForm = this.fb.group({
            branch_code: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
            code_240: [0, Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
            code_241: [0, Validators.pattern('[0-9]*')],
            code_243: [0, Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
            code_244: [0, Validators.pattern('[0-9]*')],
            code_245: [0, Validators.pattern('[0-9]*')],
            code_248: [0, Validators.pattern('[0-9]*')],
            code_249: [0, Validators.pattern('[0-9]*')]
        });
        this.dep_code = new FormControl('', Validators.compose([Validators.required, Validators.pattern('[0-9]*')]));
    }
    //--------------------------------------------------------
    ngOnInit() {
        this._http.get_current_date().pipe(take(1)).subscribe((res: any) => {
            this.mah_date = this.persianCalendarService.PersianCalendarShort(new Date(res));
        })
    }
    //--------------------------------------------------------
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
                                this.render.selectRootElement(this.branchCode.nativeElement).focus();
                                this.setPage(1);
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
    //--------------------------------------------------------
    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.pagerService.getPager(this.branchwork_list['items'].length, page);
        this.pagedItems = this.branchwork_list['items'].slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
    //--------------------------------------------------------
    create_new_document() {
        let branch_list = [];

        let new_document = { ...document };
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
                    this.setPage(1);
                    this._msg.getMessage('okSave');
                    this.create_document = false;
                } else {
                    this._msg.getMessage('errorSave');
                    this.dep_code.reset();
                }
            })
        })
    }
    //--------------------------------------------------------
    check_branch(event) {
        if (event.keyCode == 13 || event.keyCode == 9) {
            if (this.dataForm.get('branch_code').valid) {
                let branch_code = this.dataForm.get('branch_code').value;
                let branch = _.filter(_.pick(this.branchwork_list, 'items').items, (o) => {
                    return o.branch_code == branch_code;
                })
                if (branch && branch.length > 0) {
                    _.each(branch[0].items_branch, (o) => {
                        if (o.fldcode == 240) this.dataForm.patchValue({ code_240: o.amount })
                        if (o.fldcode == 241) this.dataForm.patchValue({ code_241: o.amount })
                        if (o.fldcode == 243) this.dataForm.patchValue({ code_243: o.amount })
                        if (o.fldcode == 244) this.dataForm.patchValue({ code_244: o.amount })
                        if (o.fldcode == 245) this.dataForm.patchValue({ code_245: o.amount })
                        if (o.fldcode == 248) this.dataForm.patchValue({ code_248: o.amount })
                        if (o.fldcode == 249) this.dataForm.patchValue({ code_249: o.amount })
                    })
                    this.branch_name = branch[0].branch_name;
                } else {
                    this.branch_name = null
                }
            }
        }
    }
    //--------------------------------------------------------
    update_branchwork() {
        if (this.dataForm.get('branch_code').valid && this.branch_name != null) {
            if (this.dataForm.get('code_240').value == 0 || this.dataForm.get('code_243').value == 0) {
                this._msg.getMessage('errorInput');
                return;
            }
            let mahFile_arr = [];
            //--------------------------------
            let mahFile = new MahFile(240, +this.dataForm.get('code_240').value);
            mahFile_arr.push(mahFile);
            mahFile = new MahFile(241, +this.dataForm.get('code_241').value);
            mahFile_arr.push(mahFile);
            mahFile = new MahFile(243, +this.dataForm.get('code_243').value);
            mahFile_arr.push(mahFile);
            mahFile = new MahFile(244, +this.dataForm.get('code_244').value);
            mahFile_arr.push(mahFile);
            mahFile = new MahFile(245, +this.dataForm.get('code_245').value);
            mahFile_arr.push(mahFile);
            mahFile = new MahFile(248, +this.dataForm.get('code_248').value);
            mahFile_arr.push(mahFile);
            mahFile = new MahFile(249, +this.dataForm.get('code_249').value);
            mahFile_arr.push(mahFile);
            let branch = _.filter(_.pick(this.branchwork_list, 'items').items, (o) => {
                return o.branch_code == this.dataForm.get('branch_code').value;
            })
            this.branchwork_list['items'][_.findIndex(this.branchwork_list['items'], branch[0])].items_branch = mahFile_arr;
            mahFile_arr = [];
            this._http_branchwork.update_branchwork_all(this.branchwork_list).pipe(take(1)).subscribe((res: any) => {
                if (res.nModified >= 1) {
                    this.dataForm.patchValue({
                        branch_code: 0,
                        code_240: 0, code_241: 0, code_243: 0, code_244: 0, code_245: 0, code_248: 0, code_249: 0
                    })
                    this.render.selectRootElement(this.branchCode.nativeElement).select();
                    this.branch_name = null
                } else {
                    this._msg.getMessage('errorUpdate');
                }
            })
        }
    }
    //-------------------------------------------------------
    show_error_branch(event) {
        let main_branchwork_list = this.pagedItems;
        if (event.checked) {
            let branchwork_list = _.filter(_.pick(this.branchwork_list, 'items').items, (o) => {
                return (
                    o.items_branch[_.findIndex(o.items_branch, { fldcode: 240, amount: 0 })] ||
                    o.items_branch[_.findIndex(o.items_branch, { fldcode: 243, amount: 0 })]
                )
            })
            this.pagedItems = [...branchwork_list]
        } else {
            this.pagedItems = this.branchwork_list['items'].slice(this.pager.startIndex, this.pager.endIndex + 1);
        }
    }
    //--------------------------------------------------------
    getErrorMessage(value) {
        let control: AbstractControlDirective | AbstractControl;
        control = <AbstractControl>value;
        return this._msg.getError(control.errors);
    }
}