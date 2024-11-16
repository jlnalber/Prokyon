# Prokyon

Prokyon[^1] ist eine Software zum Visualisieren von Graphen von Funktionen. Darüber hinaus kann Prokyon dynamische geometrische Konstruktionen erstellen und analytische Berechnungen durchführen.

![Banner](src/Prokyon_banner.jpg)

## Einführung

Eine von Github gehostete Version ist unter https://jlnalber.github.io/Prokyon einsehbar. Auf der linken Seite befinden sich die Tabs 'Funktionen', 'Geometrie' und 'Einstellungen', die unter den folgenden Punkten eingeführt werden.

![grafik](https://github.com/user-attachments/assets/0a7646d4-bea0-454f-ab8c-ad4f49501809)

## Funktionen

Auf diesem Tab können Funktionen durch den Button "Hinzufügen" erstellt werden. In das nun erscheinende Feld lassen sich Funktionen eintippen, z.B.:
- cos(x)
- f(x) = e^(sin(x))
- y = 2x - 9
- g(x) = sqrt(abs(x))
- h(x) = a * f(2x - 2) + 3

![grafik](https://github.com/user-attachments/assets/5d4957e5-25e1-4a42-a173-bc2dae10e9d0)

Bei Funktionen mit Label wird ein LaTeX-Label gerendert (vgl. obenstehende Grafik).
Mit Rechtsklick oder durch die drei Punkte können die Funktionen untersucht werden:
- Ableiten
- Numerische Berechnung von Null-, Extrem- und Wendepunkten
- Numerische Berechnung eines bestimmten Integrals
- Bei Auswahl zweier Funktionen (über die drei Punkte oder im Canvas) können auch Schnittpunkte und Flächen numerisch berechnet werden.

Durch Rechtsklick auf "Hinzufügen" können auch noch weitere Elemente hinzugefügt werden, wie z.B. Kurven, wodurch eine Vielzahl an geometrischen und analytischen Strukturen abgedeckt wird.
Die Punkte können auch Referenzen zu anderen Funktionen oder Variablen beinhalten und sind daher durch Änderung einer Funktion oder eines Parameters dynamisch anpassbar.

Jedes Element, welches in diesem Tab dargestellt ist, verfügt über einen farbigen Kreis links. Durch Klick kann man das Element ausblenden. Durch Hovern lässt sich die Farbe verändern.

## Geometrie

Prokyon verfügt über eine Vielzahl an geometrischen Tools:
- Bewegen: Hiermit kann man den Canvas verschieben.
- Verschieben: Hiermit kann man Elemente wie z.B. Punkte bewegen.
- Anzeigen: Ausblenden und Einblenden von Elementen.
- Label anzeigen: Ausblenden und Einblenden von Labels.
- Label bewegen: Verschiebe die Label relativ zum Element.
- Punkte: Durch Klick in den Canvas erstellt man Punkte.
- Gerade: Durch Klick auf zwei Punkte wird eine Gerade zwischen ihnen gezogen.
- Strecke: Durch Klick auf zwei Punkte wird eine Strecke zwischen ihnen gezogen.
- Kreis: Durch Klick auf zwei Punkte wird ein Kreis zwischen ihnen erstellt.
- Polygon: Durch Klick auf mehrere Punkte (und anschließend wieder auf den anfänglichen Punkt) wird ein Vieleck zwischen ihnen gezogen.
- Schnittpunkt: Hier kann man Schnittpunkte zwischen Strecken, Geraden und Kreisen berechnen.
- Mittelpunkt: Durch Klick auf zwei Punkte wird der Mittelpunkt zwischen ihnen konstruiert.
- Mittelsenkrechte: Durch Klick auf zwei Punkte wird die Mittelsenkrechte zwischen ihnen gezogen.
- Winkel: Durch Klick auf drei Punkte wird der Winkel zwischen ihnen aufgespannt.
- Winkelhalbierende: Durch Klick auf drei Punkte wird die Winkelhalbierende zwischen ihnen gezogen.
- Parallel: Durch Klick auf Punkt und Gerade/Strecke wird die Parallele gelegt.
- Lot: Durch Klick auf Punkt und Gerade/Strecke wird der Lot gefällt.
- Tangente: Durch Klick auf Punkt und Kreis werden die Tangenten an den Kreis gelegt.

Die Besonderheit besteht darin, dass die Elemente in Abhängigkeit zueinander stehen. Wird nun also z.B. ein Punkt verschoben, so verändern sich entsprechend auch die Geraden, Winkel, Kreise, etc. Dadurch kann man eine Vielzahl von geometrischen Konstruktionen vornehmen.

Will man visuelle Veränderungen vornehmen, so findet man auf dem Funktionen-Tab unter den drei Punkten den Menüpunkt "Anzeigen". Hier kann man Label bearbeiten, vergrößern, Geraden gestrichelt anzeigen usw.

![grafik](https://github.com/user-attachments/assets/06362847-e0e2-47c2-951f-70c05750af0d)

## Einstellungen

Hier können u.a. Dateien gespeichert und geöffnet werden. Die aktuell geöffnete Datei wird jedoch auch im Browser gespeichert, sodass man in einer neuen Session dort weitermachen kann, wo man aufgehört hat. Zudem wird hier eine Screenshot-Funktion zur Verfügung gestellt, wodurch die Erstellung von Grafiken für wissenschaftliche Arbeiten ermöglicht wird.

![grafik](https://github.com/user-attachments/assets/e0f5e665-f145-4612-8ddb-1bf9c437574c)

## Bug gefunden? Feedback? Verbesserungsvorschläge?

Gerne einfach ein [Issue](https://github.com/jlnalber/Prokyon/issues/new/choose) erstellen!

[^1]: Prokyon: https://de.wikipedia.org/wiki/Prokyon
