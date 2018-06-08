/* tslint:disable:member-ordering */
import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appHighlight]'
})
export class HighlightDirective {

    constructor(private renderer: Renderer2, private el: ElementRef) { }

    @Input() defaultColor: string;

    @Input('appHighlight') highlightColor: string;

    @HostListener('mouseover') onMouseOver() {
        this.highlight(this.highlightColor || this.defaultColor || 'red');
    }

    @HostListener('mouseout') onMouseOut() {
        this.highlight(null);
    }

    private highlight(color: string) {
        this.renderer.addClass(this.el.nativeElement, 'mat-elevation-z8')
        this.renderer.setStyle(this.el.nativeElement, 'color', '#E91E63')
        this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer')
        this.renderer.setStyle(this.el.nativeElement.childNodes[4], 'background-color', color);

        if(color == null){
            this.renderer.removeClass(this.el.nativeElement, 'mat-elevation-z8');
            this.renderer.setStyle(this.el.nativeElement, 'color', '#000')
            this.renderer.setStyle(this.el.nativeElement.childNodes[4], 'background-color', this.defaultColor);
        }
    }
}