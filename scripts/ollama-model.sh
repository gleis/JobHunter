#!/usr/bin/env bash
set -euo pipefail

command="${1:-list}"
model="${2:-${JOBHUNTER_OLLAMA_MODEL:-qwen3:8b}}"
base_url="${OLLAMA_BASE_URL:-http://127.0.0.1:${OLLAMA_HOST_PORT:-11434}}"

case "${command}" in
  list|ls)
    curl -s "${base_url}/api/tags"
    ;;
  pull)
    curl -s "${base_url}/api/pull" \
      -H "content-type: application/json" \
      -d "{\"name\":\"${model}\",\"stream\":false}"
    ;;
  ps)
    curl -s "${base_url}/api/ps"
    ;;
  *)
    echo "Usage: $0 list|pull|ps [model]" >&2
    exit 2
    ;;
esac
