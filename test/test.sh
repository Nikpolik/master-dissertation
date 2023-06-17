cd "$(dirname "$0")"
docker compose -p dissertation-test up --build -d && yarn run cy:run && docker compose -p dissertation-test down
