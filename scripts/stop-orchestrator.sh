#!/usr/bin/env bash
set -euo pipefail

runtime="${1:-${JOBHUNTER_RUNTIME:-apple}}"
name="${JOBHUNTER_CONTAINER_NAME:-jobhunter-orchestrator}"

case "${runtime}" in
  apple|container)
    container stop "${name}" || true
    ./scripts/stop-ollama.sh apple
    ;;
  docker)
    docker stop "${name}" || true
    ./scripts/stop-ollama.sh docker
    ;;
  *)
    echo "Unknown runtime: ${runtime}. Use apple or docker." >&2
    exit 2
    ;;
esac
