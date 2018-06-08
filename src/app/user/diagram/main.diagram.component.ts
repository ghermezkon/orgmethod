import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared.module";
import { RouterModule } from "@angular/router";
import { DepartmentDiagramComponent } from "./dep.diagram.component";
import { BranchDiagramComponent } from "./branch.diagram.component";
import { HozeDiagramComponent } from "./hoze.diagram.component";
import { SelectBranchDiagramComponent } from "./select.branch.diagram.component";

@Component({
    selector: 'main-diagram-com',
    templateUrl: './main.diagram.component.html'
})
export class DiagramComponent {
    constructor() { }
    ngOnInit() { }
}
@NgModule({
    declarations: [DiagramComponent, DepartmentDiagramComponent, BranchDiagramComponent, 
        HozeDiagramComponent, SelectBranchDiagramComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild([
            {
                path: '', component: DiagramComponent, pathMatch: 'full'
            },
        ])],
    providers: []
})
export class DiagramModule { }