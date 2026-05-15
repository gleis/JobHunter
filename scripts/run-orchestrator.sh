#!/usr/bin/env bash
set -euo pipefail

runtime="${1:-${JOBHUNTER_RUNTIME:-apple}}"
image="${JOBHUNTER_IMAGE:-jobhunter-orchestrator}"
name="${JOBHUNTER_CONTAINER_NAME:-jobhunter-orchestrator}"
host_port="${PORT:-8090}"
container_port="8090"
ollama_base_url="${OLLAMA_BASE_URL:-}"
data_store="${JOBHUNTER_DATA_STORE:-${HOME}/.jobhunter/data}"

mkdir -p "${data_store}"

if [[ "${runtime}" == "apple" || "${runtime}" == "container" ]]; then
  ollama_base_url="${ollama_base_url:-http://jobhunter-ollama.test:11434}"
elif [[ "${runtime}" == "docker" ]]; then
  ollama_base_url="${ollama_base_url:-http://host.docker.internal:11434}"
fi

env_args=(
  --env "HOST=0.0.0.0"
  --env "PORT=${container_port}"
  --env "OLLAMA_BASE_URL=${ollama_base_url}"
  --env "DATA_DIR=/data"
)

for key in OPENAI_API_KEY ANTHROPIC_API_KEY GEMINI_API_KEY; do
  if [[ -n "${!key:-}" ]]; then
    env_args+=(--env "${key}=${!key}")
  fi
done

case "${runtime}" in
  apple|container)
    container system start
    ./scripts/run-ollama.sh apple
    container stop "${name}" >/dev/null 2>&1 || true
    container build --tag "${image}" --file Containerfile .
    container run \
      --name "${name}" \
      --detach \
      --rm \
      --publish "127.0.0.1:${host_port}:${container_port}" \
      --volume "${data_store}:/data" \
      "${env_args[@]}" \
      "${image}"
    ;;
  docker)
    ./scripts/run-ollama.sh docker
    docker build --tag "${image}" --file Dockerfile .
    docker stop "${name}" >/dev/null 2>&1 || true
    docker_args=(
      --name "${name}"
      --detach
      --rm
      --publish "127.0.0.1:${host_port}:${container_port}"
      --volume "${data_store}:/data"
    )
    if [[ -f ".env" ]]; then
      docker_args+=(--env-file ".env")
    fi
    docker run "${docker_args[@]}" "${env_args[@]}" "${image}"
    ;;
  *)
    echo "Unknown runtime: ${runtime}. Use apple or docker." >&2
    exit 2
    ;;
esac

echo "JobHunter orchestrator requested on http://127.0.0.1:${host_port}"
echo "JobHunter data store: ${data_store}"
