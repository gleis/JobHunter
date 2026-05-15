#!/usr/bin/env bash
set -euo pipefail

runtime="${1:-${JOBHUNTER_RUNTIME:-apple}}"
name="${JOBHUNTER_OLLAMA_NAME:-jobhunter-ollama}"
image="${JOBHUNTER_OLLAMA_IMAGE:-docker.io/ollama/ollama:latest}"
host_port="${OLLAMA_HOST_PORT:-11434}"
store="${JOBHUNTER_OLLAMA_STORE:-${HOME}/.jobhunter/ollama}"
memory="${JOBHUNTER_OLLAMA_MEMORY:-8g}"
cpus="${JOBHUNTER_OLLAMA_CPUS:-6}"

mkdir -p "${store}"

case "${runtime}" in
  apple|container)
    container system start
    container stop "${name}" >/dev/null 2>&1 || true
    container run \
      --name "${name}" \
      --detach \
      --rm \
      --cpus "${cpus}" \
      --memory "${memory}" \
      --publish "127.0.0.1:${host_port}:11434" \
      --volume "${store}:/root/.ollama" \
      --env "OLLAMA_HOST=0.0.0.0:11434" \
      "${image}"
    ;;
  docker)
    docker stop "${name}" >/dev/null 2>&1 || true
    docker run \
      --name "${name}" \
      --detach \
      --rm \
      --publish "127.0.0.1:${host_port}:11434" \
      --volume "${store}:/root/.ollama" \
      --env "OLLAMA_HOST=0.0.0.0:11434" \
      "${image}"
    ;;
  *)
    echo "Unknown runtime: ${runtime}. Use apple or docker." >&2
    exit 2
    ;;
esac

echo "Ollama requested at http://127.0.0.1:${host_port}"
echo "Model store: ${store}"
