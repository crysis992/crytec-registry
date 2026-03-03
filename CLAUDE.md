# Crytec Registry - AI Agent Guide

This document provides comprehensive instructions for AI agents working on this project.

## Project Overview

**Crytec Registry** is a custom shadcn/ui component registry built with Next.js 15.1.3 and React 19. It allows developers to install pre-built components directly into their projects using the shadcn CLI.

- **Registry URL:** https://registry.crytec.net
- **Style:** new-york (shadcn/ui style variant)
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript (strict mode)

## AI Guidance
* Always make use of relevant skills, at the end of the task, tell the user which skills you have used.
* Only make changes that are directly requested. Keep solutions simple and focused.
* ALWAYS read and understand relevant files before proposing edits. Do not speculate about code you have not inspected.
* After receiving tool results, carefully reflect on their quality and determine optimal next steps before proceeding. Use your thinking to plan and iterate based on this new information, and then take the best next action.
* For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
* Before you finish, please verify your solution
* Do what has been asked; nothing more, nothing less.
* NEVER create files unless they're absolutely necessary for achieving your goal.
* ALWAYS prefer editing an existing file to creating a new one.
* NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
* Always prefer Next.js 16 and React 19 Features with Node 25.
* Always run 'npm run check-all' after task completion to verify your changes, fix reported errors in edited files.

# CLAUDE.md

## Projekt-Kontext

Dies ist ein TypeScript/React/Next.js Projekt.

## Feature-Pipeline

Dieses Projekt nutzt eine automatisierte Feature-Pipeline. Die Pipeline wird über Custom Commands und Subagents orchestriert.

### Commands

- `/build-feature` — Startet die komplette Pipeline: Spec → Issues → Architect Review → Implementation → QA → Final Review
- `/resume-feature` — Setzt eine unterbrochene Pipeline fort (liest Stand aus `issues/PLAN.md`)
- `/status` — Zeigt den aktuellen Pipeline-Status
- `/handoff` — Serialisiert den aktuellen Stand für Context-Window-Management

### Pipeline-Agents

Die Agents leben in `.claude/agents/` und werden automatisch vom Orchestrator aufgerufen:

1. `pm-spec` — Zerlegt Feature-Specs in Issues
2. `architect-review` — Technisches Review der Issues
3. `implementer` — Implementiert einzelne Issues
4. `qa-security` — Security-Audit
5. `qa-quality` — Code-Qualitäts-Review
6. `qa-edge-cases` — Edge Case Analyse
7. `fixer` — Behebt QA-Findings
8. `final-review` — Erstellt den Final Report

### Dateisystem-Konventionen

- `docs/feature-spec.md` — Input: Deine Feature-Spezifikation
- `docs/feature-spec.template.md` — Template für neue Feature-Specs
- `docs/feature-review.md` — Output: Finaler Review-Report
- `docs/handoff.md` — Context-Handoff bei langen Sessions
- `issues/PLAN.md` — Source of Truth für Pipeline-Status
- `issues/001-name.md` — Einzelne Issues

### Context-Window-Management

- Subagents laufen in eigenen Context Windows
- `issues/PLAN.md` ist die persistente Source of Truth
- Bei vollem Context: `/handoff` → `/clear` → `/resume-feature`
- Jeder Agent liest ZUERST `issues/PLAN.md` bevor er arbeitet

## Coding Standards

- TypeScript strict mode
- Functional Components + Hooks
- Absolute Imports wenn konfiguriert
- camelCase für Variablen, PascalCase für Components/Types
- Kein `any` ohne Begründung
- Error Handling: try/catch mit spezifischen Typen
- Commit Messages: `feat(scope): beschreibung [#issue-id]`
