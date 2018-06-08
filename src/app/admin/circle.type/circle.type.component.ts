import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { HttpDepTypeResolver, HttpCircleTypeResolver } from '../http.service/http.bank.resolver';
import { RouterModule } from '@angular/router';
import { InsertCircleTypeComponent } from './insert.circle.type.component';

@Component({
    templateUrl: 'circle.type.component.html'
})
export class CircleTypeComponent {
    constructor() { }
    ngOnInit() { }
}
@NgModule({
    declarations: [CircleTypeComponent, InsertCircleTypeComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild([
            {
                path: '', component: CircleTypeComponent, pathMatch: 'full',
                resolve: { org_circletype: HttpCircleTypeResolver }
            },
        ])],
    providers: [HttpCircleTypeResolver]
})
export class CircleTypeModule { }