# Docker Troubleshooting Guide

## Common Issues

### Container Exits Immediately
- Check `docker logs <container>`
- Verify the command/entrypoint
- Ensure the process is long-running

### Port Not Reachable
- Confirm port publishing: `-p host:container`
- Check app bind address (0.0.0.0 vs 127.0.0.1)
- Verify container is running

### File Not Found Or Permission Errors
- Confirm correct working directory in Dockerfile
- Validate volume or bind mount paths
- Check user permissions and `USER` directive

### Build Cache Confusion
- Inspect Dockerfile order
- Use `--no-cache` to validate changes
- Keep frequently changing files late in Dockerfile

### Image Too Large
- Use multi-stage builds
- Choose smaller base images
- Remove build-only dependencies

### DNS Or Network Failures
- Verify network: `docker network ls`
- Inspect container network config
- Try a user-defined bridge network

## Evidence To Request
- `docker version` and `docker info`
- `docker ps -a` and `docker images`
- `docker inspect <container>`
- Full error output
