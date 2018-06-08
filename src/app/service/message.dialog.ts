import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
        <button mat-raised-button mat-dialog-close color="warn" type="button">بستن</button>
    `
})
export class MessageDialogComponent implements OnInit {
    constructor( @Inject(MAT_DIALOG_DATA) public data: any) { }
    ngOnInit() { }
}