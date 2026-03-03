Führe die komplette Feature-Pipeline autonom durch. Lies IMMER zuerst `issues/PLAN.md` um den aktuellen Stand zu kennen und setze dort fort wo zuletzt aufgehört wurde.

## Vorbereitung

1. Prüfe ob `docs/feature-spec.md` existiert. Wenn nicht: STOPP und frage den User.
2. Prüfe ob `issues/PLAN.md` existiert. Wenn ja: Lies den Stand und setze fort.
3. Erstelle `issues/` Verzeichnis falls nicht vorhanden.

## Pipeline

### Phase 1: Spec → Issues
- Nutze den **pm-spec** Subagent um die Feature-Spec in Issues zu zerlegen
- Prüfe dass `issues/PLAN.md` und die Issue-Dateien erstellt wurden
- Lies `issues/PLAN.md` und prüfe ob die Zerlegung sinnvoll ist

### Phase 2: Architecture Review
- Nutze den **architect-review** Subagent um alle DRAFT Issues zu reviewen
- Prüfe dass alle Issues einen Status-Update bekommen haben
- Wenn Issues `NEEDS_REVISION` sind: Nutze den **pm-spec** Subagent erneut um sie zu überarbeiten
- Wenn Issues `SPLIT_REQUIRED` sind: Nutze **pm-spec** um sie aufzuteilen
- Wiederhole Phase 2 bis alle Issues `READY_FOR_BUILD` sind (max 3 Iterationen)

### Phase 3: Implementation (pro Issue, sequentiell)
Für jedes Issue mit Status `READY_FOR_BUILD` (in der Reihenfolge aus PLAN.md):

1. Nutze den **implementer** Subagent für das Issue
2. Prüfe ob Tests grün sind
3. Wenn Tests fehlschlagen: Schicke es nochmal an **implementer** (max 2 Retries)

### Phase 4: QA (pro implementiertem Issue)
Für jedes Issue mit Status `IMPLEMENTED`:

1. Nutze den **qa-security** Subagent
2. Nutze den **qa-quality** Subagent
3. Nutze den **qa-edge-cases** Subagent
4. Wenn IRGENDEIN QA-Report `FAIL` enthält:
   - Nutze den **fixer** Subagent
   - Wiederhole die fehlgeschlagenen QA-Checks (max 2 Iterationen)

### Phase 5: Final Review
- Nutze den **final-review** Subagent
- Der Report wird in `docs/feature-review.md` geschrieben

## KRITISCHE REGELN

1. **Context-Management**: Lies `issues/PLAN.md` VOR und NACH jedem Subagent-Aufruf. Es ist deine Source of Truth.
2. **Fehler-Toleranz**: Wenn ein Subagent fehlschlägt, versuche es maximal 2x erneut. Danach dokumentiere den Fehler in PLAN.md und fahre fort.
3. **Keine Endlosschleifen**: Max 3 Iterationen für Architecture Review, max 2 Retries für Implementation, max 2 Iterationen für QA-Fixes.
4. **Fortschritt dokumentieren**: Aktualisiere PLAN.md nach JEDER Phase.
5. **Am Ende**: Gib dem User eine kurze Zusammenfassung und verweise auf `docs/feature-review.md`.
