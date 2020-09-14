sh scripts/stop.sh
docker container prune -f
docker volume prune -f
docker image prune -f
