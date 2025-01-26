Minefield Escape
=============

Funkční specifikace
-------------------

### Popis:

Tento projekt je hra sestavená zejména v JavaScriptu, níže jsou její hlavní funkcionality:

*   umožňuje pohyb hráče pomocí šipek
*   detekuje, když hráč opustí minefield (výhry)
*   pomocí Math.random generuje na cca 50% políčcích miny
*   zajišťuje, že každý level bude vyhratelný
*   ukládá do localstorage nejvyšší dosažený level 
*   pamatuje si počet smrtí a level (resetuje se)
*   obsahuje vlastní grafiku a zobrazuje miny po prohře
*   cílem je trénování všímavosti a krátkodobé paměti hráče


### Licence/License

*  Při kreditaci autora (Froggytron -> https://fcoc-vs-battles.fandom.com/wiki/User:Froggytron) jde sdílet, kopírovat a upravovat :]
*  With crediting the author (Froggytron -> https://fcoc-vs-battles.fandom.com/wiki/User:Froggytron), you can share, copy and alter this project :]


### Uživatelské rozhraní

Hra se zejména skládá z klasické html tabulky, do níž se generují obrázky min a panáčka (hráče). S každým pohybem se generuje obraz kolem hráče znovu. Hra též přikládá textové informace v pravém horním rohu.

### Usecase diagram

yet to be done

Technická specifikace
---------------------

### Algoritmické provedení

*   Hra funguje na objektovém programování v JavaScriptu, zároveň minimalisticky využívá prvky HTML (tabulka) a CSS (nejzákladnější styly) pro realizaci grafického zobrazení. 
*   Kód obsahuje tři třídy: Player, Renderer, GameField
*   Třída Player: Jejím hlavním úkolem je si pamatovat pozici hráče, číslo levelu, počet smrtí, souřadnice, na které jiné třídy mohou odkazovat díky funkcím set a get.
*   Třída GameField: Obsahuje dvourozměrné pole, které v sobě drží herní plochu. Obsahuje funkce pro pohyb hráče, volání rendereru, generuje miny (kde z nich zpětně 50% náhodně maže), zajišťuje cestičku pro zajištění vyhratelnosti levelu. Řeší výhru levelu a generuje novou plochu dalšího levelu.
*   Renderer: Je schopná aktualizovat vykreslení plochy při průběhu hry (většinu času pouze v oblasti kolem hráče pro vyšší optimalizaci). Při splněném levelu/game over smaže veškerá grafická data a vykreslí je znovu podle aktualizovaných informací ve třídě GameField (které jsou Renderer předány). 
*   Výhra se detekuje v momentě, kdy panáček vedený hráčem úspěšně opustí herní plochu. Prohra nastává, když se panáček naskytne na stejném políčku, jako je mina. Prohra ukáže hráči pozice min, aby si mohl cestu lépe memorizovat a měl vyšší šance vyhrání příště.

### Class diagram

*   In this folder



