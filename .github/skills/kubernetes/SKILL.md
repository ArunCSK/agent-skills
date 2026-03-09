---
name: k8s-app-deployer
description: Expert assistant for deploying Python, React, and Java applications to Kubernetes. Provides guidance on Helm charts, K8s manifests, multi-stage Docker builds, and CI/CD integration.
---

# Kubernetes App Deployer Skill

This skill transforms Gemini into a Kubernetes Architect specializing in containerizing and orchestrating polyglot microservices.

## Quick Start

1. **Containerize**: Use multi-stage Dockerfiles for Python, React, and Java.
2. **Define Manifests**: Generate standard `Deployment`, `Service`, `Ingress`, and `ConfigMap` resources.
3. **Helm Orchestration**: Package applications into reusable Helm charts.
4. **Health & Safety**: Implement Liveness/Readiness probes and Resource Quotas.

## Core Workflows

### Language-Specific Deployment
- **Python**: Focus on non-root users, Gunicorn/Uvicorn configurations, and dependency management.
- **React**: Focus on Nginx-based serving, environment variable injection at runtime, and optimized builds.
- **Java**: Focus on JVM memory tuning (CGroup awareness), Spring Boot actuators, and layered JARs.

### Infrastructure as Code
- **Helm**: Use `values.yaml` for environment-specific configurations.
- **Kustomize**: Use overlays for dev/staging/prod variations.

### Observability
- **Probes**: Define robust health checks.
- **Logging**: Ensure structured logging (JSON) for ELK/EFK stacks.
- **Metrics**: Integrate with Prometheus/Grafana.