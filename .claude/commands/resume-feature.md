Die Feature-Pipeline wurde unterbrochen. Setze sie fort.

## Workflow

1. Lies `issues/PLAN.md` — das ist dein aktueller Stand
2. Identifiziere die letzte abgeschlossene Phase und das letzte bearbeitete Issue
3. Setze die Pipeline exakt dort fort wo sie aufgehört hat
4. Folge dem selben Ablauf wie `/build-feature`

## Status-Interpretation

- Issues mit `DRAFT` → Phase 2 (Architect Review) steht noch aus
- Issues mit `NEEDS_REVISION` → Revision nötig, dann zurück zu Phase 2
- Issues mit `READY_FOR_BUILD` → Phase 3 (Implementation) steht aus
- Issues mit `IMPLEMENTED` ohne QA-Abschnitte → Phase 4 (QA) steht aus
- Issues mit QA `FAIL` ohne Fix Report → Fixer steht aus
- Issues mit `FIXES_APPLIED` → QA Re-Check steht aus
- Alle Issues `PASS` → Phase 5 (Final Review) steht aus

Aktualisiere PLAN.md nach jedem Schritt.
