import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { RouterModule } from '@angular/router';
import { HttpBankResolver } from '../http.service/http.bank.resolver';
import { InsertBankComponent } from './insert.bank.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
    templateUrl: 'bank.component.html',
    styleUrls: ['./bank.component.css'],
})
export class BankComponent implements OnInit {
    constructor() { }
    ngOnInit() { }
}
@NgModule({
    declarations: [BankComponent, InsertBankComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild([
            {
                path: '', component: BankComponent, pathMatch: 'full',
                resolve: { org_bank: HttpBankResolver }
            },
        ])],
    providers: [HttpBankResolver]
})
export class BankModule { }