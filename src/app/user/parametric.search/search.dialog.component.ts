import { Component } from '@angular/core';
import { DepartmentHttpService } from '../../admin/http.service/http.dep.service';
import { MessageService } from '../../service/message.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material';
import { take } from 'rxjs/operators';

@Component({
    templateUrl: 'search.dialog.component.html',
    styleUrls: ['search.dialog.component.css']
})
export class SearchDialogComponent {
    field_selected: any = undefined;
    operate_selected: any = undefined;
    field_value: any = undefined;
    branch_type_list: any[] = [];
    arz_type_list: any[] = [];

    code_menu: any[] = [
        {
            field_code_en: 'branch_code', field_code_fa: 'کد شعبه',
            operate:
                [{ operate_en: '$eq', operate_fa: 'برابر با' }, { operate_en: '$lt', operate_fa: 'کوچکتر از' },
                { operate_en: '$lte', operate_fa: 'کوچکتر مساوی با' }, { operate_en: '$gt', operate_fa: 'بزرگتر از' },
                { operate_en: '$gte', operate_fa: 'بزرگتر مساوی با' }]
        },
        {
            field_code_en: 'branch_name', field_code_fa: 'نام شعبه',
            operate:
                [{ operate_en: '$eq', operate_fa: 'برابر با' }, { operate_en: '$regex', operate_fa: 'شامل' }]
        },
        {
            field_code_en: 'branch_code_posti', field_code_fa: 'کد پستی',
            operate:
                [{ operate_en: '$eq', operate_fa: 'برابر با' }, { operate_en: '$lt', operate_fa: 'کوچکتر از' },
                { operate_en: '$lte', operate_fa: 'کوچکتر مساوی با' }, { operate_en: '$gt', operate_fa: 'بزرگتر از' },
                { operate_en: '$gte', operate_fa: 'بزرگتر مساوی با' }]
        },
        {
            field_code_en: 'branch_email', field_code_fa: 'ایمیل شعبه',
            operate:
                [{ operate_en: '$eq', operate_fa: 'برابر با' }, { operate_en: '$regex', operate_fa: 'شامل' }]
        },
        {
            field_code_en: 'branch_degree', field_code_fa: 'درجه شعبه',
            operate:
                [{ operate_en: '$eq', operate_fa: 'برابر با' }, { operate_en: '$lt', operate_fa: 'کوچکتر از' },
                { operate_en: '$lte', operate_fa: 'کوچکتر مساوی با' }, { operate_en: '$gt', operate_fa: 'بزرگتر از' },
                { operate_en: '$gte', operate_fa: 'بزرگتر مساوی با' }]
        },
        {
            field_code_en: 'branch_type', field_code_fa: 'نوع واحد',
            operate:
                [{ operate_en: '$eq', operate_fa: 'برابر با' }]
        },
        {
            field_code_en: 'ostan.ostan_name', field_code_fa: 'استان',
            operate:
                [{ operate_en: '$eq', operate_fa: 'برابر با' }, { operate_en: '$regex', operate_fa: 'شامل' }]
        },        
        {
            field_code_en: 'city.city_name', field_code_fa: 'شهر',
            operate:
                [{ operate_en: '$eq', operate_fa: 'برابر با' }, { operate_en: '$regex', operate_fa: 'شامل' }]
        }
    ];
    //-----------------------------------------------------------------
    constructor(private _http_dep: DepartmentHttpService, public dialogRef: MatDialogRef<SearchDialogComponent>,
        private _msg: MessageService, private router: Router) { }
    //-----------------------------------------------------------------
    ngOnInit() {
        this.branch_type_list = this._msg.getBranchType();
    }
    //-----------------------------------------------------------------
    generate_query() {
        var query;
        query = {
            desc_fa: this.field_selected.field_code_fa + ' ' + this.operate_selected.operate_fa + ' ' + this.field_value,
            desc_en: '"' + this.field_selected.field_code_en + '":{"' + this.operate_selected.operate_en + '":"' + this.field_value + '"}'
        };

        this._http_dep.get_branch_parametric(query.desc_en).pipe(take(1)).subscribe((res: any) => {
            this._http_dep.setBranchSource(res);
            this.field_selected = undefined;
            this.operate_selected = undefined;
            this.field_value = undefined;
            this.router.navigate(['/list']);
            this.dialogRef.close();
        })
    }
    //-----------------------------------------------------------------
}