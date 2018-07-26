import { Component } from "@angular/core";
import { FormControl, Validators, AbstractControlDirective, AbstractControl } from "@angular/forms";
import { MessageService } from "../../service/message.service";
import { ActivatedRoute } from "@angular/router";
import { map, take } from "rxjs/operators";
import * as _ from 'lodash';
import { BranchWorkHttpService } from "../../admin/http.service/http.branchwork.service";
import { GlobalHttpService } from "../../admin/http.service/global.http.service";
import { ReportBranchWorkService } from "./repo.branch.work.service";

@Component({
    selector: 'table-branch-work-com',
    templateUrl: './table.branch.work.component.html'
})
export class TableBranchWorkComponent {
    dep_code: FormControl;
    branch_code: FormControl;
    table_id: FormControl;
    mah_date: FormControl;
    //-------------------------------------------------------
    branchwork_list: any = undefined;
    branch: any;
    //-------------------------------------------------------
    table_list: any[] = [];
    branch_table: any[] = [];
    mah_date_list: any[] = [];
    //-------------------------------------------------------
    constructor(private _msg: MessageService, private _http_branchwork: BranchWorkHttpService, private _http: GlobalHttpService,
        private route: ActivatedRoute, private reportService: ReportBranchWorkService) {
        this.dep_code = new FormControl('', Validators.compose([Validators.required, Validators.pattern('[0-9]*')]));
        this.branch_code = new FormControl('', Validators.compose([Validators.required, Validators.pattern('[0-9]*')]));
        this.table_id = new FormControl('', Validators.required);
        this.mah_date = new FormControl('', Validators.required);
    }
    //-------------------------------------------------------
    ngOnInit() {
        this.route.data.pipe(
            map((data) => data['org_mah_date']),take(1)).subscribe((org_mah_date) => {
                if (org_mah_date.length > 0) {
                    this.mah_date_list = org_mah_date;
                } else {

                }
            });
        this.table_list = this._msg.getTableNumber();
    }
    //-------------------------------------------------------
    tableSelect(event) {
        var self = this;
        let fldcode_data: any[] = [];
        this._http.get_all_tablecode_by_table_id(event.value).pipe(take(1)).subscribe((res: any) => {
            if (res.length > 0) {
                self.branch = _.find(_.pick(this.branchwork_list[0], 'items').items, (p) => {
                    return p.branch_code == self.branch_code.value;
                });
                if (self.branch) {
                    fldcode_data = res;
                    for (var i = 0; i < fldcode_data.length; i++) {
                        fldcode_data[i].itemList = fldcode_data[i].group_code.split('-');
                    }

                    let all_field = _.concat(self.branch.items_dep, self.branch.items_branch);

                    for (var i = 0; i < fldcode_data.length; i++) {
                        for (var j = 0; j < fldcode_data[i].itemList.length; j++) {
                            var findValue = _.find(all_field, (o) => {
                                return o.fldcode == fldcode_data[i].itemList[j]
                            })

                            if (findValue)
                                fldcode_data[i].itemList[j] = findValue.amount;
                            else
                                fldcode_data[i].itemList[j] = 0;
                        }
                    }
                    this.reportService.set_table_id_Source(fldcode_data);
                } else {
                    self.branch = undefined;
                }
            } else {
                self.branch = undefined;
            }
        })

    }
    //-------------------------------------------------------
    find_branchwork() {
        this._http_branchwork.get_current_branchwork(this.mah_date.value, this.dep_code.value).pipe(take(1)).subscribe((res: any) => {
            if (res.length > 0) {
                this.branchwork_list = res;
            } else {
                this.branchwork_list = undefined;
            }
        })
    }
    dateSelect(event){
        if(event.value){
        }else{
            this.branch = undefined;
        }
        this.branch_code.reset();
        this.table_id.reset();
        this.branchwork_list = [];    
    }
    //-------------------------------------------------------
    getErrorMessage(value) {
        let control: AbstractControlDirective | AbstractControl;
        control = <AbstractControl>value;
        return this._msg.getError(control.errors);
    }
    //-------------------------------------------------------
}