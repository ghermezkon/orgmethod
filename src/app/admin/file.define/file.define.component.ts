import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { RouterModule } from '@angular/router';
import { InsertFileDefineComponent } from './insert.file.define.component';

@Component({
    templateUrl: 'file.define.component.html'
})
export class FileDefineComponent {
    constructor() { }
    ngOnInit() { }
}
@NgModule({
    declarations: [FileDefineComponent, InsertFileDefineComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild([
            {
                path: '', component: FileDefineComponent, pathMatch: 'full'
            },
        ])],
    providers: []
})
export class FileDefineModule { }