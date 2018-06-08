import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: 'main.content.component.html',
})
export class MainContentComponent {
    main_menu: any[] = [];
    branchwork_menu: any[] = [];
    //--------------------------------------------
    constructor() { }
    ngOnInit() {
        this.main_menu = [
            { menu_link: '/bank', menu_title: 'تعریف مشخصات اولیه بانک', menu_icon: "fa fa-university fa-4x", footer_text: 'اطلاعات اولیه مشخصات بانک، ویرایش و سایر موارد' },
            { menu_link: '/department', menu_title: 'تعریف ادارت', menu_icon: "fa fa-building-o fa-4x", footer_text: 'تعریف ادارات، شعب مستقل، بیمارستان به همراه کادر مصوب' },
            { menu_link: '/hoze', menu_title: 'تعریف حوزه ها', menu_icon: "fa fa-code-fork fa-4x", footer_text: 'تعریف حوزه ها، ویرایس اطلاعات و سایر موارد' },
            { menu_link: '/branch', menu_title: 'تعریف شعب', menu_icon: "fa fa-sitemap fa-4x", footer_text: 'تعریف شعب، مشخصات ملک، کادر مصوب و سایر موارد' },
            { menu_link: '/diagram', menu_title: 'کادر مصوب', menu_icon: "fa fa-users fa-4x", footer_text: 'نمایش کادر مصوب ادارات، حوزه ها، و شعب' }
        ];

        this.branchwork_menu = [
            { menu_link: '/branchwork', menu_title: 'ثبت حجم کار ماهیانه', menu_icon: "fa fa-book fa-4x", footer_text: 'ثبت آمار هفتگانه حجم کار توسط ادارات امور شعب' },
            { menu_link: '/filedefine', menu_title: 'بروزرسانی حجم کار ماهیانه', menu_icon: "fa fa-archive fa-4x", footer_text: 'بروز رسانی آمار حجم کار ادارت امور توسط اداره کل' },
            { menu_link: '/reportbw', menu_title: 'گزارشات حجم کار ماهیانه', menu_icon: "fa fa-table fa-4x", footer_text: 'نمایش گزاراشت مختلف از حجم کا رماهیانه اداره امور شعب' },
        ];

    }
}
