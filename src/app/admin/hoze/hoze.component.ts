import { Component, OnInit, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { RouterModule } from '@angular/router';
import { HttpDepartmentResolver } from '../http.service/http.bank.resolver';
import { InsertHozeComponent } from './insert.hoze.component';

@Component({
    templateUrl: 'hoze.component.html'
})
export class HozeComponent implements OnInit {
    constructor() { }
    ngOnInit() { }
}
@NgModule({
    declarations: [HozeComponent, InsertHozeComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild([
            {
                path: '', component: HozeComponent, pathMatch: 'full',
                resolve: { org_department: HttpDepartmentResolver }
            },
        ])],
    providers: [HttpDepartmentResolver]
})
export class HozeModule { }