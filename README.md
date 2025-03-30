✅ Când e OK să folosești signal ca un BehaviorSubject:
 Dacă ai state local într-o componentă

 Dacă nu ai nevoie să "te abonezi" din alte locuri

 Dacă nu folosești RxJS operators (map, switchMap, etc.)

 Dacă vrei performanță și cod mai curat

 ❌ Când să NU folosești signal:
 Dacă ai stream-uri de date (ex: WebSocket, HTTP polling)

 Dacă trebuie să te abonezi din afară sau din servicii

 Dacă vrei să folosești operatori RxJS


You read a signal's value by calling its getter function, which allows Angular to track where the signal is used.

Signals may be either writable or read-only.

const count = signal(0);
// Signals are getter functions - calling them reads their value.
console.log('The count is: ' + count());


✅ Writable signals have the type WritableSignal.



✅ Ce sunt computed signals în Angular?

computed() este o funcție care creează un signal derivat, adică un signal care își calculează valoarea pe baza altor signals. Acestea sunt read-only și se actualizează automat când se schimbă signals-urile din care derivă.

Read-only	Da — nu poți face .set() pe el
Auto-recalculare	Da — se actualizează când sursele se schimbă
Memoizare	Da — dacă sursele nu se schimbă, valoarea e reutilizată
Util în template	Da — poți folosi direct {{ computedSignal() }}


Când folosești computed?
Când ai nevoie de un derivat dintr-un signal, fără să faci setări manuale.

Ca să eviți cod redundant sau duplicat pentru calcule.

Ca să îți păstrezi logica clară și reactivă.


📘 computed signals în Angular sunt:
✅ Lazy evaluated (evaluare întârziată)
Adică: nu se evaluează imediat când se schimbă un signal din care derivă, doar când cineva le accesează (ex: în componentă sau template).

➡️ Dacă nu folosești computedSignal() nicăieri, Angular nu-l calculează. Optimizare pură. 🧠

✅ Memoized
Adică: dacă a fost deja calculat și valorile sursă nu s-au schimbat, Angular nu recalculează, ci returnează rezultatul anterior.

➡️ Evită calcule inutile, mai ales dacă derivarea e costisitoare.

Rezumat
Proprietate	Înseamnă
Lazy evaluation	Nu se evaluează până nu e nevoie
Memoization	Păstrează ultima valoare dacă input-urile nu s-au schimbat
Optimizare automată	Angular gestionează eficient reactivitatea, fără efort suplimentar



🔁 Dependențele unui computed sunt dinamice
Doar signals-urile citite efectiv în timpul evaluării sunt urmărite.

🔧 Exemplu:

ts
Copy
Edit
const showCount = signal(false);
const count = signal(0);

const conditionalCount = computed(() => {
return showCount() ? `The count is ${count()}.` : 'Nothing to see here!';
});
📌 Dacă showCount() este false, count() nu este citit, deci conditionalCount nu depinde de count.

➡️ Asta înseamnă că, dacă modifici count, conditionalCount nu se recalculează – pentru că nu e dependent de el în starea actuală.



🔁 În Angular (cu OnPush):
Dacă NU folosești un signal() în template sau într-un computed() care e legat de template...

➡️ Componenta NU se re-randează când acel signal se schimbă.

🔍 De ce?
Pentru că Angular face update doar dacă vede că template-ul e dependent de signal.
E o optimizare: dacă nu e citit, înseamnă că nu afectează UI-ul → deci nu e nevoie de re-render.


effect() – reacții automate la schimbări
Un effect este o funcție care se execută automat ori de câte ori se schimbă unul sau mai multe signals.

🎯 Diferența cheie:
Aspect	computed()	effect()
✅ Returnează valoare	Da – derivă o valoare nouă	❌ Nu – doar execută o acțiune
🧠 Folosit pentru	Derivare de stare (ex: total, dublu, etc.)	Side effects (loguri, API, manipulări)
📦 Memorizează?	Da (memoizat automat)	Nu – doar reacționează
🔁 Reexecutare	Când se schimbă dependențele	La fel, dar fără a memora rezultatul


You can prevent a signal read from being tracked by calling its getter with untracked:
untracked(counter)


Ce este un effect cleanup?
Uneori, un effect() are nevoie să elibereze resurse sau să oprească lucruri vechi (ex: timeout-uri, subscriptions etc.) înainte să ruleze din nou sau să fie distrus.

De aceea, effect() permite să returnezi o funcție de cleanup – aceasta se va apela automat înainte ca efectul să ruleze din nou sau când este distrus complet.


Create a signal from an RxJs Observable with toSignal
Use the toSignal function to create a signal which tracks the value of an Observable. It behaves similarly to the async pipe in templates, but is more flexible and can be used anywhere in an application.

Injection context
toSignal by default needs to run in an injection context, such as during construction of a component or service. If an injection context is not available, you can manually specify the Injector to use instead.

Initial values
Observables may not produce a value synchronously on subscription, but signals always require a current value. There are several ways to deal with this "initial" value of toSignal signals.

manualCleanup
By default, toSignal automatically unsubscribes from the Observable when the component or service that creates it is destroyed.

To override this behavior, you can pass the manualCleanup option. You can use this setting for Observables that complete themselves naturally.

Error and Completion
If an Observable used in toSignal produces an error, that error is thrown when the signal is read.

If an Observable used in toSignal completes, the signal continues to return the most recently emitted value before completion.
