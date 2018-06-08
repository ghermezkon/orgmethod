import { Component, OnInit, NgModule } from '@angular/core';
import { InsertOstanComponent } from './insert.ostan.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { RouterModule } from '@angular/router';
import { HttpOstanResolver } from '../http.service/http.bank.resolver';

@Component({
    templateUrl: 'ostan.component.html'
})
export class OstanComponent implements OnInit {
    constructor() { }
    ngOnInit() { }
}
@NgModule({
    declarations: [OstanComponent, InsertOstanComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild([
            {
                path: '', component: OstanComponent, pathMatch: 'full',
                resolve: { org_ostan: HttpOstanResolver }
            },
        ])],
    providers: [HttpOstanResolver]
})
export class OstanModule { }