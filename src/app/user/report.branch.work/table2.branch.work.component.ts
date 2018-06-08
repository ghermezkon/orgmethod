import { Component } from "@angular/core";
import { ReportBranchWorkService } from "./repo.branch.work.service";

@Component({
    selector: 'table-two-branch-work-com',
    template: `
        <table class="table-diagram" style="direction:rtl;">
            <thead>
                <tr>
                    <th class="th-diagram center th-header-diagram">#</th>
                    <th class="th-diagram">شرح جدول 2</th>
                    <th class="th-diagram center" style="width:12%;">تعداد طی سال</th>
                    <th class="th-diagram center" style="width:12%;">گردش خالص حسابها</th>
                </tr>
            </thead>
        <ng-container *ngFor="let i of fldcode_data; let idx = index;let isOdd=odd;">
            <tr [class.oddRow]="isOdd">
                <td class="td-diagram center th-header-diagram">{{idx+1}}</td>

                <td [ngClass]="{'td-diagram': true, 'td-sum-diagram': i.sum_flag}">{{i.row_name}}</td>
                <td [ngClass]="{'td-diagram':true, 'center':true, 'td-sum-diagram': i.sum_flag}" style="width:10%;" colspan="2" *ngIf="i.itemList.length == 1">{{i.itemList[0] | number}}</td>

                <ng-container *ngIf="i.itemList.length > 1">
                    <td [ngClass]="{'td-diagram': true, 'center': true,'td-sum-diagram': i.sum_flag}" style="width:12%;">{{i.itemList[0] | number}}</td>
                    <td [ngClass]="{'td-diagram': true, 'center': true,'td-sum-diagram': i.sum_flag}" style="width:12%;">{{i.itemList[1] | number}}</td>
                </ng-container>
            </tr>
        </ng-container>
    </table>
    `
})
export class TableTwoBranchWorkComponent {
    fldcode_data: any[] = [];
    //---------------------------------------------------
    constructor(private reportService: ReportBranchWorkService) { }
    //---------------------------------------------------
    ngOnInit() {
        this.reportService.get_table_id_Source().subscribe((res: any) => {
            this.fldcode_data = res;
        })
    }
    //---------------------------------------------------
}