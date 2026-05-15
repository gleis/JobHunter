#!/usr/bin/env bash
set -euo pipefail

runtime="${1:-${JOBHUNTER_RUNTIME:-apple}}"
name="${JOBHUNTER_OLLAMA_NAME:-jobhunter-ollama}"

case "${runtime}" in
  apple|container)
    container stop "${name}" || true
    ;;
  docker)
    docker stop "${name}" || true
    ;;
  *)
    echo "Unknown runtime: ${runtime}. Use apple or docker." >&2
    exit 2
    ;;
esac
