import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { RouterModule } from '@angular/router';
import { HttpDepartmentResolver } from '../http.service/http.bank.resolver';
import { InsertBranchComponent } from './insert.branch.component';
import { FlagService } from '../../service/flag.service';
import { GlobalHttpService } from '../http.service/global.http.service';
import { BranchAmlakComponent } from './branch.amlak.component';
import { BranchCircleComponent } from './branch.circle.component';
import { DepartmentHttpService } from '../http.service/http.dep.service';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs';

@Component({
    templateUrl: 'branch.component.html'
})
export class BranchComponent {
    complete$: Subject<boolean> = new Subject();
    reset_branch_personel_table: boolean = false
    flag_show_branch_circle_tab: boolean = false;
    flag_show_branch_amlak_tab: boolean = false;

    constructor(private _flag: FlagService, private _http: GlobalHttpService,
        private _http_dep: DepartmentHttpService) {
        this._flag.get_show_branch_amlak_tab_Source().takeUntil(this.complete$).subscribe((res: any) => {
            this.flag_show_branch_amlak_tab = res;
        })
        this._flag.get_show_branch_circle_tab_Source().takeUntil(this.complete$).subscribe((res: any) => {
            this.flag_show_branch_circle_tab = res;
        })
    }
    ngOnInit() { }
    tabChange(event) {
        if (event.index == 1) {
            this._flag.set_show_branch_amlak_tab_Source(true);

        } else if (event.index == 2) {
            this._flag.set_show_branch_circle_tab_Source(true);
            this._http.get_all_circletype().takeUntil(this.complete$).subscribe((res: any) => {
                this._http_dep.setCircleTypeSource(res);
            })
        } else {
            this._flag.set_reset_branch_personel_table_Source(false);
        }
    }
    ngOnDestroy() {
        this.complete$.next(true);
        this.complete$.complete();
    }
}
@NgModule({
    declarations: [BranchComponent, InsertBranchComponent, BranchAmlakComponent, BranchCircleComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild([
            {
                path: '', component: BranchComponent, pathMatch: 'full',
                resolve: { org_department: HttpDepartmentResolver }
            },
        ])],
    providers: [HttpDepartmentResolver]
})
export class BranchModule { }