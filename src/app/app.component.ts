import {ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, effect, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';


interface User {
  name: string;
  age: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.component.css'
})
export class AppComponent {
  user = signal<User>({ name: 'Andrei', age: 22 });
  count = signal(2);
  private loggingEffect = effect(() => {
    console.log(`The count is: ${this.count()}`);
  });
  double = computed(() => this.count() * 2);
  constructor(private changeDetectorRef: ChangeDetectorRef) {

  }

  incrementCount() {
   this.count.set(Math.random())
    effect(() => {
      console.log(`Count s-a schimbat! Valoare curentă: ${this.count()}`);
    });
     }

  incrementAgeWithoutUpdate() {
    this.user().age++; // Angular nu știe că trebuie să actualizeze DOM-ul!
   // De ce? Pentru că tu modifici obiectul intern, dar nu ai chemat set() pe signal, deci Angular nu face nimic.
  }

  detectChange() {
    this.changeDetectorRef.detectChanges();
  }

  updateAge(nr: string) {
    this.user.update(u => ({
      ...u,
      age: Number(nr)
    }));
  }

  incrementAge() {
    this.user.set({ ...this.user(), age: this.user().age + 1 });
  }
}


//✅ Când e OK să folosești signal ca un BehaviorSubject:
// Dacă ai state local într-o componentă
//
// Dacă nu ai nevoie să "te abonezi" din alte locuri
//
// Dacă nu folosești RxJS operators (map, switchMap, etc.)
//
// Dacă vrei performanță și cod mai curat
//
// ❌ Când să NU folosești signal:
// Dacă ai stream-uri de date (ex: WebSocket, HTTP polling)
//
// Dacă trebuie să te abonezi din afară sau din servicii
//
// Dacă vrei să folosești operatori RxJS


//🔄 Ce sunt computed signals în Angular?
//  computed() este o funcție care creează un signal derivat,
//  adică un signal care își calculează valoarea pe baza altor signals.
//  Acestea sunt read-only și se actualizează automat când se schimbă signals-urile din care
//  derivă.
