import { Component } from "@angular/core";
import { ReportBranchWorkService } from "./repo.branch.work.service";
import { MessageService } from "../../service/message.service";

@Component({
    selector: 'table-one-branch-work-com',
    template: `
        <table class="table-diagram" id="table123" style="direction:rtl;">
            <thead>
                <tr>
                    <th class="th-diagram" colspan="6" style="text-align:left;">
                    </th>
                <tr>
                <tr>
                    <th class="th-diagram">#</th>
                    <th class="th-diagram">جدول 1</th>
                    <th colspan="4" class="th-diagram">تعداد اسناد طی سال</th>
                </tr>
            </thead>
        <ng-container *ngFor="let i of fldcode_data; let idx = index;let isOdd=odd;">
            <tr *ngIf="idx == 3" style="font-weight:bold;text-align:center;background-color:#eaeaea;">
                <td class="td-diagram center th-header-diagram">#</td>
                <td class="td-diagram">شرح</td>
                <td class="td-diagram center" style="width:12%;">نقدی متمرکز</td>
                <td class="td-diagram center" style="width:12%;">نقدی سیبا</td>
                <td class="td-diagram center" style="width:12%;">انتقالی غیرمتمرکز</td>
                <td class="td-diagram center" style="width:12%;">انتقالی سیبا</td>
            </tr>
            <tr [class.oddRow]="isOdd">
                <td class="td-diagram center th-header-diagram">{{idx+1}}</td>

                <td [ngClass]="{'td-diagram': true, 'td-sum-diagram': i.sum_flag}">{{i.row_name}}</td>
                <td [ngClass]="{'td-diagram':true, 'center':true, 'td-sum-diagram': i.sum_flag}" style="width:10%;" colspan="4" *ngIf="i.itemList.length == 1">{{i.itemList[0] | number}}</td>

                <ng-container *ngIf="i.itemList.length > 1">
                    <td [ngClass]="{'td-diagram': true, 'center': true,'td-sum-diagram': i.sum_flag}" style="width:12%;">{{i.itemList[0] | number}}</td>
                    <td [ngClass]="{'td-diagram': true, 'center': true,'td-sum-diagram': i.sum_flag}" style="width:12%;">{{i.itemList[1] | number}}</td>
                    <td [ngClass]="{'td-diagram': true, 'center': true,'td-sum-diagram': i.sum_flag}" style="width:12%;">{{i.itemList[2] | number}}</td>
                    <td [ngClass]="{'td-diagram': true, 'center': true,'td-sum-diagram': i.sum_flag}" style="width:12%;">{{i.itemList[3] | number}}</td>
                </ng-container>
            </tr>
        </ng-container>
    </table>
    `
})
export class TableOneBranchWorkComponent {
    fldcode_data: any[] = [];
    //---------------------------------------------------
    constructor(private reportService: ReportBranchWorkService, private _msg: MessageService) { }
    //---------------------------------------------------
    ngOnInit() {
        this.reportService.get_table_id_Source().subscribe((res: any) => {
            this.fldcode_data = res;
        })
    }
    //---------------------------------------------------
}