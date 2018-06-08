import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material';

@Component({
    template: `
        <h2 mat-dialog-title style="direction:rtl;">پیغام سیستمی</h2> 
        <div class="ui container">
            <div class="ui grid container">
                <div class="right aligned wide column">
                    <mat-dialog-content>{{data.message}}</mat-dialog-content>
                </div>
            </div>
        </div>
        <div mat-dialog-actions>
            <button mat-raised-button (click)="cancel()" mat-dialog-close color="primary" tabindex="-1" type="button">لغو عملیات</button>        
            <button mat-raised-button (click)="confirmResult()" color="warn" type="button">حذف رکورد</button>        
        </div>
    `
})
export class ConfirmDialogComponent implements OnInit {
    constructor(private dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }
    ngOnInit() { }
    cancel() {
        this.dialogRef.close();
    }
    confirmResult() {
        this.dialogRef.close('confirm');
    }
}