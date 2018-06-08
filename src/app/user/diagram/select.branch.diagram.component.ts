import { Component } from "@angular/core";
import { FormControl, Validators, AbstractControlDirective, AbstractControl } from "@angular/forms";
import { MessageService } from "../../service/message.service";
import { DepartmentHttpService } from "../../admin/http.service/http.dep.service";
import { Subject } from "rxjs";
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from "@angular/material";
import * as _ from 'lodash';
class posttype {
    posttype_code: number;
    value: number;
    sum: number = 0;
    constructor(posttype_code, value, sum) {
        this.posttype_code = posttype_code;
        this.value = value;
        this.sum = sum;
    }
}
class Row {
    circle: string;
    sum: number = 0;
    row: any[];
    constructor(circle, row, sum) {
        this.circle = circle;
        this.row = row;
        this.sum = sum;
    }
}
@Component({
    selector: 'select-branch-diagram-com',
    templateUrl: './select.branch.diagram.component.html'
})
export class SelectBranchDiagramComponent {
    complete$: Subject<boolean> = new Subject();
    dep_code: FormControl;
    dep_code_correct: boolean = false;
    branch_table: any[] = [];
    branch_list = [];
    column_name: any = [];
    sum_rows: any[] = [];
    all_sum: any;

    visible: boolean = true;
    selectable: boolean = true;
    removable: boolean = true;
    addOnBlur: boolean = true;
    //------------------------------------------------
    constructor(private _msg: MessageService, private _http_dep: DepartmentHttpService) {
        this.dep_code = new FormControl('', Validators.compose([Validators.required, Validators.pattern('[0-9]*')]));
    }
    //------------------------------------------------
    ngOnInit() { }

    separatorKeysCodes = [ENTER, COMMA];
    checkDepartment() {
        this._http_dep.get_by_dep_code(this.dep_code.value.trim()).take(1).subscribe((res: any) => {
            if (res.length > 0) this.dep_code_correct = true;
            else {
                this.dep_code_correct = false;
                this._msg.getMessage('notExistRecord');
                this.branch_list = [];
                this.branch_table = [];
            }
        })
    }
    add(event: MatChipInputEvent): void {
        if (this.dep_code.value) {
            let input = event.input;
            let value = event.value;
            if (input) {
                input.value = '';
            }
            this._http_dep.get_branch_by_branch_dep_code(this.dep_code.value.trim(), value.trim()).take(1).takeUntil(this.complete$).subscribe((res: any) => {
                if (res.length > 0) {
                    this.branch_list.push({ name: res[0].branch_name, value: value.trim() })
                }
            })
        }
    }

    remove(data: any): void {
        let index = this.branch_list.indexOf(data);
        if (index >= 0) {
            this.branch_list.splice(index, 1);
        }
    }
    find() {
        var row_circlelist: any = [];
        var rows: any[] = [];
        var column_name: any[] = [];
        var column_class: any = [];
        var hoze_header: any[] = [];
        let branch_list: string = '';

        _.each(this.branch_list, (o) => {
            branch_list += o.value + ','
        })
        this._http_dep.get_branch_by_branch_list(branch_list).take(1).takeUntil(this.complete$).subscribe((res: any) => {
            if (res.length > 0) {

                this.column_name = alasql('SEARCH DISTINCT(/circlelist/personel/posttype) FROM ?', [res], function (res) {
                    return _.sortBy(res, 'posttype_code');
                })
                column_name = this.column_name;
                for (let c of this.column_name) {
                    var new_c = new posttype(+c.posttype_code, 0, 0)
                    column_class.push(new_c);
                }

                for (var b of res) {
                    var temp_row: any[] = [...column_class];
                    for (var c of b.circlelist) {
                        for (var p of c.personel) {
                            for (var col of column_class) {
                                if (col.posttype_code == p.posttype.posttype_code) {
                                    temp_row[temp_row.findIndex(el => el.posttype_code == p.posttype.posttype_code)].value += +p.personel_number;
                                }
                            }//column
                        }
                    }
                    rows.push(new Row(b.branch_name, temp_row, _.sumBy(temp_row, 'value')));
                    column_class.length = 0;
                    for (let c of this.column_name) {
                        var new_c = new posttype(+c.posttype_code, 0, 0)
                        column_class.push(new_c);
                    }

                    temp_row = [...column_class]
                }
                _.each(rows, (r) => {
                    _.each(r.row, (a) => {
                        _.each(column_class, (c) => {
                            if (a.posttype_code == c.posttype_code) {
                                c.sum += +a.value;
                            }
                        })
                    })
                })
                this.all_sum = _.sumBy(rows, 'sum');
                this.sum_rows = column_class;
                rows.push(new Row('جمع کل', this.sum_rows, this.all_sum))
                this.branch_table = rows;
            } else {
                this.branch_table = [];
                this._msg.getMessage('notExistRecord');
            }
        })
    }
    export() {
        let print_table = alasql('SELECT * FROM HTML("#table123",{headers:true,skipdisplaynone:true})', function (res) {
            return res;
        });
        this._msg.export_to_excel(print_table, 'کادر مصوب شعب منتخب')
    }
    //------------------------------------------------
    getErrorMessage(value) {
        let control: AbstractControlDirective | AbstractControl;
        control = <AbstractControl>value;
        return this._msg.getError(control.errors);
    }
    //------------------------------------------------
    ngOnDestroy() {
        this.complete$.next(true);
        this.complete$.complete();
    }
    //------------------------------------------------
}