#!/usr/bin/env bash
set -euo pipefail

runtime="${1:-${JOBHUNTER_RUNTIME:-apple}}"
name="${JOBHUNTER_OLLAMA_NAME:-jobhunter-ollama}"
image="${JOBHUNTER_OLLAMA_IMAGE:-jobhunter-ollama:0.40.15-maintenance}"
repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
host_port="${OLLAMA_HOST_PORT:-11434}"
store="${JOBHUNTER_OLLAMA_STORE:-${HOME}/.jobhunter/ollama}"
memory="${JOBHUNTER_OLLAMA_MEMORY:-8g}"
cpus="${JOBHUNTER_OLLAMA_CPUS:-6}"

mkdir -p "${store}"

case "${runtime}" in
  apple|container)
    container system start
    if [[ -z "${JOBHUNTER_OLLAMA_IMAGE:-}" ]]; then
      container build --tag "$image" --file "$repo_dir/deploy/secure/Ollama.Dockerfile" "$repo_dir"
    fi
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
    if [[ -z "${JOBHUNTER_OLLAMA_IMAGE:-}" ]]; then
      docker build --tag "$image" --file "$repo_dir/deploy/secure/Ollama.Dockerfile" "$repo_dir"
    fi
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
