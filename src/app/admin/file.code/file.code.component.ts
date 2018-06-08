import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { RouterModule } from '@angular/router';
import { InsertFileCodeComponent } from './insert.file.code.component';

@Component({
    templateUrl: 'file.code.component.html'
})
export class FileCodeComponent {
    constructor() { }
    ngOnInit() { }
}
@NgModule({
    declarations: [FileCodeComponent, InsertFileCodeComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild([
            {
                path: '', component: FileCodeComponent, pathMatch: 'full'
            },
        ])],
    providers: []
})
export class FileCodeModule { }