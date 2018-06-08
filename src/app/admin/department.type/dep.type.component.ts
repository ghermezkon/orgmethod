import { Component, OnInit, NgModule } from '@angular/core';
import { InsertDepTypeComponent } from './insert.dep.type.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { HttpDepTypeResolver } from '../http.service/http.bank.resolver';
import { RouterModule } from '@angular/router';

@Component({
    templateUrl: 'dep.type.component.html'
})
export class DepartmentTypeComponent {
    constructor() { }
    ngOnInit() { }
}
@NgModule({
    declarations: [DepartmentTypeComponent, InsertDepTypeComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild([
            {
                path: '', component: DepartmentTypeComponent, pathMatch: 'full',
                resolve: { org_deptype: HttpDepTypeResolver }
            },
        ])],
    providers: [HttpDepTypeResolver]
})
export class DepartmentTypeModule { }