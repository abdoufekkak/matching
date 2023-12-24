// src/app/scroll.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root', // Assurez-vous de spécifier providedIn: 'root' pour que le service soit injectable globalement.
})
export class ScrollService {
  // Utilisez un sujet pour émettre des événements.
  private scrollEvent = new Subject<void>();

  // Méthode pour s'abonner à l'observable émis par le sujet.
  onScroll() {
    return this.scrollEvent.asObservable();
  }

  // Méthode pour émettre un événement lorsque vous atteignez le bas de la page.
  scrollBottomReached() {

    this.scrollEvent.next();

  }
}
