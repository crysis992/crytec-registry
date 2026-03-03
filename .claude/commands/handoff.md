Das Context Window wird voll. Serialisiere den aktuellen Stand für eine neue Session.

## Workflow

1. Lies `issues/PLAN.md`
2. Lies alle Issue-Dateien
3. Erstelle/aktualisiere `docs/handoff.md` mit folgendem Inhalt:

```markdown
# Handoff — [Datum/Uhrzeit]

## Aktuelle Phase
[Phase 1-5, welcher Schritt genau]

## Letztes bearbeitetes Issue
[Issue-ID und was genau der Stand ist]

## Nächster Schritt
[Exakt was als nächstes getan werden muss]

## Zusammenfassung bisheriger Arbeit
[Kompakte Zusammenfassung aller bisherigen Änderungen]

## Offene Probleme
[Falls vorhanden]

## Befehl zum Fortsetzen
Nutze `/resume-feature` um die Pipeline fortzusetzen.
```

4. Bestätige dem User dass der Handoff geschrieben wurde
5. Empfehle dem User `/clear` auszuführen und dann `/resume-feature`
