import { Component, NgModule } from '@angular/core';
import { InsertDepartmentComponent } from './insert.dep.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { RouterModule } from '@angular/router';
import { DepartmentHttpService } from '../http.service/http.dep.service';
import { HttpDepartmentResolver } from '../http.service/http.bank.resolver';
import { FlagService } from '../../service/flag.service';
import { CircleDepartmentComponent } from './circle.dep.component';
import { GlobalHttpService } from '../http.service/global.http.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    templateUrl: 'dep.component.html'
})
export class DepartmentComponent {
    complete$: Subject<boolean> = new Subject();
    flag_show_department_circle_tab: boolean = false;
    constructor(private _flag: FlagService, private _http: GlobalHttpService,
        private _http_dep: DepartmentHttpService) {
        this._flag.get_department_circle_Source().pipe(takeUntil(this.complete$)).subscribe((res: any) => {
            this.flag_show_department_circle_tab = res;
        })
    }
    //---------------------------------------------
    tabChange(event) {
        if (event.index == 1) {
            this._flag.set_department_circle_Source(true);
            this._http.get_all_circletype().pipe(takeUntil(this.complete$)).subscribe((res: any) => {
                this._http_dep.setCircleTypeSource(res);
            })
        } else {
            this._flag.set_department_circle_Source(false);
        }
    }
    ngOnDestroy() {
        this.complete$.next(true);
        this.complete$.complete();
    }
}
@NgModule({
    declarations: [DepartmentComponent, InsertDepartmentComponent, CircleDepartmentComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild([
            {
                path: '', component: DepartmentComponent, pathMatch: 'full',
                resolve: { org_department: HttpDepartmentResolver }
            },
        ])],
    providers: [HttpDepartmentResolver]
})
export class DepartmentModule { }