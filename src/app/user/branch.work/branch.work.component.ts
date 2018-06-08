import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { RouterModule } from '@angular/router';
import { InsertBranchWorkComponent } from './insert.branch.work.component';
import { HttpDepartmentResolver } from '../../admin/http.service/http.bank.resolver';

@Component({
    templateUrl: 'branch.work.component.html'
})
export class BranchWorkComponent {
    constructor() { }
    ngOnInit() { }
}
@NgModule({
    declarations: [BranchWorkComponent, InsertBranchWorkComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild([
            {
                path: '', component: BranchWorkComponent, pathMatch: 'full',
                resolve: { org_department: HttpDepartmentResolver }
            },
        ])],
    providers: [HttpDepartmentResolver]
})
export class BranchWorkModule { }