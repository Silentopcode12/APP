---
name: docker-mastery
description: Docker learning, practice, and mastery coaching. Use when the user wants to master Docker, requests hands-on Docker practice, needs a structured Docker learning path, wants labs/exercises/projects, or needs guidance across images, containers, Dockerfiles, Compose, volumes, networking, debugging, performance, and security.
---

# Docker Mastery

## Overview
Provide a structured, hands-on path to master Docker with progressive labs, mini-projects, troubleshooting practice, and best-practice guidance.

## Quick Start
1. Clarify the user goal: certification prep, production readiness, or project-based learning.
2. Choose a path: beginner, intermediate, or advanced.
3. Pick a lab or project from `references/learning_path.md`.
4. Use assets in `assets/labs/` as starter materials when a lab needs files.

## Practice Flow
1. Assess current level with a short diagnostic (3-5 questions).
2. Assign a lab with clear success criteria and timebox.
3. Provide a step-by-step plan, then let the user implement.
4. Review output, ask for evidence (commands run, logs, file tree).
5. Debrief with fixes, best practices, and a next-step lab.

## Core Topics Checklist
Use `references/checklists.md` to ensure coverage of:
- Images and layers
- Dockerfiles and builds
- Containers and runtime
- Volumes and bind mounts
- Networks and DNS
- Compose and multi-service apps
- Logs and debugging
- Performance and resource limits
- Security basics
- Registry usage and CI/CD

## Labs And Projects
- Prefer labs that build on each other and mirror real-world tasks.
- Use `assets/labs/` as starter files; copy into the user workspace if needed.
- For each lab, include:
  - Goal
  - Constraints (time, size, tools)
  - Success criteria
  - Common pitfalls

## Troubleshooting Guidance
- When the user is stuck, request:
  - `docker version` and `docker info`
  - `docker ps -a` and `docker images`
  - The exact error and command used
- Use `references/troubleshooting.md` for common root causes.

## Output Patterns
When assigning a lab, format as:
- Goal
- Prereqs
- Steps
- Success Criteria
- Stretch Goals

## Resources
- `references/learning_path.md`: curated progression of labs
- `references/checklists.md`: topic coverage checklist
- `references/troubleshooting.md`: common errors and fixes
- `assets/labs/`: starter code and Dockerfiles for labs
