# Docker Mastery Learning Path

## Beginner
1. Hello Container
- Goal: Run your first container and inspect it
- Lab: `assets/labs/01-hello`
- Skills: `docker run`, `docker ps`, `docker logs`, `docker exec`

2. Build A Simple Image
- Goal: Create a Dockerfile and build an image
- Lab: `assets/labs/02-python`
- Skills: `docker build`, `.dockerignore`, tagging

3. Data Persistence
- Goal: Use volumes and bind mounts
- Skills: `-v`, `--mount`, volume lifecycle

4. Networking Basics
- Goal: Connect two containers
- Skills: bridge network, DNS, port publishing

## Intermediate
5. Multi-Stage Builds
- Goal: Create slim production images
- Skills: multi-stage, caching, build args

6. Compose Essentials
- Goal: Run a multi-service app
- Lab: `assets/labs/03-compose`
- Skills: `docker compose up`, networks, volumes

7. Debugging Practice
- Goal: Diagnose a failing container
- Skills: logs, exec, inspect, healthchecks

8. Image Optimization
- Goal: Reduce size and build time
- Skills: layer ordering, cache, base images

## Advanced
9. Security Basics
- Goal: Harden images and runtime
- Skills: non-root, capabilities, secrets, scan

10. Resource Control
- Goal: Limit CPU/memory and observe behavior
- Skills: cgroups, limits, monitoring

11. Registry And CI
- Goal: Push images and integrate in CI
- Skills: tagging, auth, CI pipeline steps

12. Troubleshooting Scenarios
- Goal: Solve real incident-style issues
- Skills: root cause analysis, runbooks
