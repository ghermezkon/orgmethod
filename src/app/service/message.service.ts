import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MessageDialogComponent } from "./message.dialog";
import * as alasql from 'alasql';
import { ConfirmDialogComponent } from "./confirm.dialog";
import { SearchDialogComponent } from "../user/parametric.search/search.dialog.component";

@Injectable()
export class MessageService {
    constructor(private dialog: MatDialog) { }
    getError(error) {
        if (error.required)
            return '* الزامی';
        else if (error.pattern)
            return 'فقط عدد وارد نمائید';
        else if (error.maxlength)
            return 'حداکثر ' + error.maxlength.requiredLength + ' حرف وارد نمائید';
        else if (error.minlength)
            return 'حداقل ' + error.minlength.requiredLength + ' حرف وارد نمائید';
        else if (error.email)
            return 'آدرس ایمیل اشتباه است';
    }
    getMessage(name) {
        if (name == 'okSave')
            this.openDialog('ذخیره اطلاعات با موفقیت انجام گردید');
        else if (name == 'errorSave')
            this.openDialog('خطا در ذخیره اطلاعات');
        else if (name == 'okUpdate')
            this.openDialog('ویرایش اطلاعات با موفقیت انجام گردید');
        else if (name == 'errorUpdate')
            this.openDialog('خطا در ویرایش اطلاعات');
        else if (name == 'doubleRecord')
            this.openDialog('رکورد ورودی تکراری می باشد');
        else if (name == 'notExistRecord')
            this.openDialog('رکورد مورد نظر در سیستم تعریف نشده است');
        else if (name == "fileError")
            this.openDialog("فراخوانی فایل با مشکل روبرو شده است");
        else if (name == "okFile")
            this.openDialog("فراخوانی فایل انجام گردید");
        else if (name == "errorInput")
            this.openDialog("لطفاً اطلاعات را کامل وارد نمائید");
        else if (name == "confirmDelete")
            return this.openConfirm("آیا تمایل به حذف رکورد دارید؟");
    }
    getCityType() {
        let cityType: any[] = [];
        cityType.push('شهرستان');
        cityType.push('شهر');
        cityType.push('دهستان');
        cityType.push('بخش');
        return cityType;
    }
    getKhadamatType() {
        let khadamatType: any[] = [];
        khadamatType.push('ریالی');
        khadamatType.push('ارزی');
        khadamatType.push('PLS');
        khadamatType.push('VIP');
        khadamatType.push('کارگشایی');
        return khadamatType;
    }
    getOrganType() {
        let organType: any[] = [];
        organType.push('شهرداری');
        organType.push('گمرک');
        organType.push('فرودگاه');
        organType.push('آموزش پرورش');
        organType.push('سایر');
        return organType;
    }
    getBranchType() {
        let branchType: any[] = [];
        branchType.push('شعبه');
        branchType.push('باجه');
        branchType.push('کارگشایی');
        branchType.push('صندوق قرض الحسنه');
        return branchType;
    }
    getArzType() {
        let arzType: any[] = [];
        arzType.push('خدمات اولیه بازرگانی');
        arzType.push('غیر بازرگانی');
        arzType.push('تمام ارزی بازرگانی');
        return arzType;
    }
    getActivityType() {
        let activityType: any[] = [];
        activityType.push('تجاری');
        activityType.push('خدماتی');
        activityType.push('اختصاصی');
        return activityType;
    }
    getDegree() {
        let degree: any[] = [];
        degree.push('ممتاز الف');
        degree.push('ممتاز ب');
        degree.push('1');
        degree.push('2');
        degree.push('3');
        degree.push('4');
        degree.push('5');
        degree.push('6');
        return degree;
    }
    getMelkType() {
        let melk: any[] = [];
        melk.push({ name: 'ملکی', type: '0' });
        melk.push({ name: 'تملیکی', type: '0' });
        melk.push({ name: 'استیجاری بدون سرقفلی', type: '0' });
        melk.push({ name: 'استیجاری با سرقفلی', type: '0' });
        melk.push({ name: 'واگذاری استیجاری', type: '1' });
        melk.push({ name: 'واگذاری امانی', type: '1' });
        melk.push({ name: 'اوقافی', type: '2' });
        return melk;
    }
    getTableNumber() {
        let table: any[] = [];
        table.push('جدول 1');
        table.push('جدول 2');
        table.push('جدول 3');
        table.push('جدول 4');
        table.push('جدول 5');
        return table;
    }
    getPostGroup() {
        let postGroup: any[] = [];
        postGroup.push({ 'key': 'branch', 'value': 'مربوط به صف' });
        postGroup.push({ 'key': 'both', 'value': 'مربوط به صف و ستاد' });
        return postGroup;
    }
    getCode(code?: any){
        if((code >= 1 && code <= 3) || (code >= 44 && code <= 69) || (code >= 252 && code <= 254) ||
            (code >= 360 && code <= 367) || (code >= 184 && code <= 216) ||
            (code >= 260 && code <= 272) || (code >= 164 && code <= 183) || (code >= 220 && code <= 224)) 
                return 'تعداد اسناد طی سال';
        else if ((code >= 123 && code <= 125) || (code >= 129 && code <= 160) || (code >= 225 && code <= 229) ||
            (code >= 341 && code <= 348) || (code >= 70 && code <= 96) || (code >= 255 && code <= 257))
            return 'مانده یا گردش حسابها';
        else if((code >= 4 && code <= 16) || code == 318) return 'نقدی غیر متمرکز';
        else if(code >= 303 && code <= 317) return 'نقدی سیبا';
        else if((code >= 21 && code <= 35) || (code >= 240 && code <= 250) || code == 338) return 'انتقالی غیر متمرکز';
        else if(code >= 323 && code <= 337) return 'انتقالی سیبا';

    }
    openDialog(msg): void {
        let dialogRef = this.dialog.open(MessageDialogComponent, {
            width: '50%',
            data: { message: msg }
        });
    }
    
    openConfirm(msg) {
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '50%',
            data: { message: msg }
        });
        return dialogRef;
    }
    export_to_excel(data, sheetid) {
        var mystyle = {
            headers: true,
            sheetid: sheetid,
            style: 'font-family:B Nazanin;text-align:center;vertical-align:middle;',
            caption: {
                title: sheetid,
            },
            column: {
                style: 'background:#538ED5;border:solid .5pt windowtext;'
            },
            row: {
                style: 'border:solid .5pt windowtext;'
            },
        };
        alasql('SELECT * INTO XLS("' + sheetid + '.xls",?) FROM ?', [mystyle, data]);
    }
}