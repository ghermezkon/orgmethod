import { Component, OnInit, NgModule } from '@angular/core'
import { InsertCityComponent } from './insert.city.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { RouterModule } from '@angular/router';
import { HttpOstanResolver } from '../http.service/http.bank.resolver';

@Component({
    templateUrl: 'city.component.html'
})
export class CityComponent implements OnInit {
    constructor() { }
    ngOnInit() { }
}
@NgModule({
    declarations: [CityComponent, InsertCityComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild([
            {
                path: '', component: CityComponent, pathMatch: 'full',
                resolve: { org_ostan: HttpOstanResolver }
            },
        ])],
    providers: [HttpOstanResolver]
})
export class CityModule { }