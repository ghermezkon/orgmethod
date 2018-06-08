import { Component, OnInit, NgModule } from '@angular/core';
import { InsertEquipmentComponent } from './insert.equipment.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { RouterModule } from '@angular/router';
import { HttpEquipmentResolver } from '../http.service/http.bank.resolver';

@Component({
    templateUrl: 'equipment.component.html'
})
export class EquipmentComponent {
    constructor() { }
    ngOnInit() { }
}
@NgModule({
    declarations: [EquipmentComponent, InsertEquipmentComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild([
            {
                path: '', component: EquipmentComponent, pathMatch: 'full',
                resolve: { org_equipment: HttpEquipmentResolver }
            },
        ])],
    providers: [HttpEquipmentResolver]
})
export class EquipmentModule { }