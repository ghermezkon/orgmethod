import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { RouterModule } from '@angular/router';
import { HttpDepartmentResolver, HttpMahDateResolver } from '../../admin/http.service/http.bank.resolver';
import { TableBranchWorkComponent } from './table.branch.work.component';
import { TableOneBranchWorkComponent } from './table1.branch.work.component';
import { TableTwoBranchWorkComponent } from './table2.branch.work.component';
import { TableThreeBranchWorkComponent } from './table3.branch.work.component';
import { TableFourBranchWorkComponent } from './table4.branch.work.component';
import { TableFiveBranchWorkComponent } from './table5.branch.work.component';
import { Min_MaxReportBranchWorkComponent } from './min.max.branch.work.component';
import { AmountByFldCodeComponent } from './amount.by.fldcode.component';

@Component({
    templateUrl: 'report.branch.work.component.html'
})
export class ReportBranchWorkComponent {
    constructor() { }
    ngOnInit() { }
}
@NgModule({
    declarations: [ReportBranchWorkComponent, TableBranchWorkComponent,
        TableOneBranchWorkComponent, TableTwoBranchWorkComponent, TableThreeBranchWorkComponent,
        TableFourBranchWorkComponent, TableFiveBranchWorkComponent,
        Min_MaxReportBranchWorkComponent, AmountByFldCodeComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild([
            {
                path: '', component: ReportBranchWorkComponent, pathMatch: 'full',
                resolve: { org_mah_date: HttpMahDateResolver }
            },
        ])],
    providers: [HttpMahDateResolver]
})
export class ReportBranchWorkModule { }