# Kubernetes Deployment Patterns

## Language-Specific Best Practices

### Python (FastAPI/Flask/Django)
- **Base Image**: Use `python:3.11-slim` to reduce attack surface.
- **User**: Always use `USER 1000` (non-root).
- **Signals**: Use `tini` or `dumb-init` to handle PID 1 issues.

### React (Frontend)
- **Build**: Multi-stage build using `node` for building and `nginx:alpine` for serving.
- **Config**: Use a shell script entrypoint to inject environment variables into `window._env_` at runtime.
- **Caching**: Configure Nginx for efficient static asset caching.

### Java (Spring Boot/Quarkus)
- **Memory**: Use `-XX:MaxRAMPercentage=75.0` to ensure JVM respects K8s memory limits.
- **Layers**: Use Spring Boot's layered JAR feature to optimize Docker layer caching.
- **Probes**: Map Liveness/Readiness to `/actuator/health/liveness` and `/actuator/health/readiness`.

## Common Manifest Patterns

### Resource Management
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### Security Context
```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
```