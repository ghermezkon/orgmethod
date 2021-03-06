import { Component } from "@angular/core";
import { FormControl, Validators, AbstractControlDirective, AbstractControl } from "@angular/forms";
import { MessageService } from "../../service/message.service";
import { DepartmentHttpService } from "../../admin/http.service/http.dep.service";
import * as _ from 'lodash';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
//------------------------------------------------------
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
    row: any[];
    sum: number = 0;
    constructor(circle, row, sum) {
        this.circle = circle;
        this.row = row;
        this.sum = sum;
    }
}
//------------------------------------------------------
@Component({
    selector: 'branch-diagram-com',
    templateUrl: './branch.diagram.component.html',
})
export class BranchDiagramComponent {
    complete$: Subject<boolean> = new Subject();
    //-------------------------------------------------------------------------------    
    dep_code: FormControl;
    branch_code: FormControl;
    branch_table: any[] = [];
    branch_header: any[] = [];
    column_name: any = [];
    all_sum: any;
    sum_rows: any[] = [];
    //------------------------------------------------    
    constructor(private _msg: MessageService, private _http_dep: DepartmentHttpService) {
        this.dep_code = new FormControl('', Validators.compose([Validators.required, Validators.pattern('[0-9]*')]));
        this.branch_code = new FormControl('', Validators.compose([Validators.required, Validators.pattern('[0-9]*')]));
    }
    ngOnInit() { }
    //------------------------------------------------
    find(dep_code, branch_code) {
        let row_circlelist: any = [];
        let column_class: any = [];
        let rows: any[] = [];
        this._http_dep.get_branch_by_branch_dep_code(dep_code, branch_code).pipe(takeUntil(this.complete$)).subscribe((res: any) => {
            if (res.length > 0) {
                this.branch_header = res[0];
                row_circlelist = _.pick(res[0], 'circlelist');
                row_circlelist['circlelist'] = _.orderBy(row_circlelist['circlelist'], 'circletype_code', 'desc');

                this.column_name = alasql('SEARCH DISTINCT(/personel/posttype) FROM ?', [row_circlelist['circlelist']], function (res) {
                    return _.sortBy(res, 'posttype_code');
                })
                for (let c of this.column_name) {
                    let new_c = new posttype(+c.posttype_code, '', 0)
                    column_class.push(new_c);
                }
                row_circlelist['circlelist'] = _.sortBy(row_circlelist['circlelist'], 'circletype_code');
                _.each(row_circlelist['circlelist'], function (o) {
                    let circle = o.circletype_name;
                    if (o.personel) {
                        let sum = 0;
                        let temp_row: any[] = [...column_class];
                        for (let p of o.personel) {
                            let k = +p.posttype.posttype_code;
                            sum += + p.personel_number;
                            temp_row[temp_row.findIndex(el => el.posttype_code === k)] = new posttype(k, p.personel_number, 0);
                        }
                        rows.push(new Row(circle, temp_row, sum))
                        temp_row = [...column_class];
                    }
                })
                this.branch_table = Array.from(rows);
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
    //------------------------------------------------
    export() {
        let print_table = alasql('SELECT * FROM HTML("#table123",{headers:true,skipdisplaynone:true})', function (res) {
            return res;
        });
        this._msg.export_to_excel(print_table, 'کادر مصوب شعبه')
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