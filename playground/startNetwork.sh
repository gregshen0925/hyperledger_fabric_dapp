
export PATH=${PWD}/../bin/linux-amd64:$PATH
export FABRIC_CFG_PATH=$PWD/config/

cryptogen generate --config=./config/crypto-config-orderer.yaml --output=./crypto-config
cryptogen generate --config=./config/crypto-config-org.yaml --output=./crypto-config

configtxgen -configPath ./config -profile OrderersGenesis -channelID system-channel -outputBlock ./system-genesis-block/genesis.block

configtxgen -configPath ./config -profile ThreeOrgsChannel -outputCreateChannelTx ./channel-artifacts/cathay.tx -channelID cathay


configtxgen -configPath ./config -profile ThreeOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/org1Anchors.tx -channelID cathay -asOrg Org1MSP
configtxgen -configPath ./config -profile ThreeOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/org2Anchors.tx -channelID cathay -asOrg Org2MSP
configtxgen -configPath ./config -profile ThreeOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/org3Anchors.tx -channelID cathay -asOrg Org3MSP


cd docker
docker-compose -f orderer-docker-compose.yaml -f peer-docker-compose.yaml up -d

cd ..