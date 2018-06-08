import { Component } from "@angular/core";
import { MessageService } from "../../service/message.service";
import { DepartmentHttpService } from "../../admin/http.service/http.dep.service";
import { FormControl, Validators, AbstractControlDirective, AbstractControl } from "@angular/forms";
import { Subject } from "rxjs";
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';

import * as _ from 'lodash';
import * as alasql from 'alasql';
//---------------------------------------------------------------
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
//---------------------------------------------------------------
@Component({
    selector: 'hoze-diagram-com',
    templateUrl: './hoze.diagram.component.html'
})
export class HozeDiagramComponent {
    complete$: Subject<boolean> = new Subject();
    //-------------------------------------------------------------------------------    
    dep_code: FormControl;
    hoze_code: FormControl;
    column_name: any = [];
    dep_table: any[] = [];
    hoze_header: any[] = [];
    row_branch: any[] = [];
    sum_rows: any[] = [];
    all_sum: any;
    hoze_list: any[] = [];
    //---------------------------------------------------------------
    constructor(private _msg: MessageService, private _http_dep: DepartmentHttpService) {
        this.dep_code = new FormControl('', Validators.compose([Validators.required, Validators.pattern('[0-9]*')]));
        this.hoze_code = new FormControl('', Validators.compose([Validators.required, Validators.pattern('[0-9]*')]));
    }
    //---------------------------------------------------------------
    get_hoze() {
        this._http_dep.get_hoze_by_dep_code(this.dep_code.value).take(1).takeUntil(this.complete$).subscribe((res: any) => {
            if (res.length > 0) this.hoze_list = res;
            else {
                this.hoze_list = [];
                this.dep_table = [];
            }
        })
    }
    //---------------------------------------------------------------
    find(dep_code, hoze_code) {
        var row_circlelist: any = [];
        var rows: any[] = [];
        var column_name: any[] = [];
        var column_class: any = [];
        var hoze_header: any[] = [];

        this._http_dep.get_branch_by_hoze_code(dep_code, hoze_code).take(1).takeUntil(this.complete$).subscribe((res: any) => {
            if (res.length > 0) {
                this.hoze_header = res[0];

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
                this.dep_table = rows;
            } else {
                this.dep_table = [];
                this._msg.getMessage('notExistRecord');
            }
        })
    }
    //---------------------------------------------------------------
    hozeSelect(event) {
        if (!event.value) {
            this.dep_table = [];
        }
    }
    //---------------------------------------------------------------
    getErrorMessage(value) {
        var control: AbstractControlDirective | AbstractControl;
        control = <AbstractControl>value;
        return this._msg.getError(control.errors);
    }
    //---------------------------------------------------------------
    export() {
        let print_table = alasql('SELECT * FROM HTML("#table123",{headers:true,skipdisplaynone:true})', function (res) {
            return res;
        });
        this._msg.export_to_excel(print_table, 'کادر مصوب حوزه')
    }
    //---------------------------------------------------------------
    ngOnDestroy() {
        this.complete$.next(true);
        this.complete$.complete();
    }
}