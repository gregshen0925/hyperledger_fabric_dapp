cd docker
docker-compose -f orderer-docker-compose.yaml -f peer-docker-compose.yaml down
cd ..

docker container prune
docker volume prune


rm -rf ./crypto-config
rm -rf ./system-genesis-block
rm -rf ./channel-artifacts
