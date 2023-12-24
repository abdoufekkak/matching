import { Directive, ElementRef, HostListener } from '@angular/core';
import { ScrollService } from './scroll.service';

@Directive({
  selector: '[appScroll]'
})
export class ScrollDirective {

  constructor(private el: ElementRef,private scrollService: ScrollService) { }

  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void {
    const element = this.el.nativeElement as HTMLElement;
    const scrollY =           element.scrollTop;
    const windowHeight =     element.clientHeight;
    const documentHeight =   element.scrollHeight;

    if (this.isNearBottom(scrollY, windowHeight, documentHeight)) {
      this.scrollService.scrollBottomReached();
    }
  }

  private isNearBottom(scrollY: number, windowHeight: number, documentHeight: number): boolean {
    // Définissez un seuil pour déclencher le chargement de plus de données

    // Vérifiez si la position actuelle de l'élément est proche du bas
    return scrollY + windowHeight  >= documentHeight;
  }
}
