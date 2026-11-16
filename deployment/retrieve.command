#!/bin/bash
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")/../" ; pwd -P )
cd "$parent_path"

# Load dotenv
export $(cat .env | xargs)


dt=$(date +%F)
echo "Saving experiment to ${DATA_PATH}/tajriba-${dt}.json"

sftp -b - -i "$SERVER_PEM" $SERVER_SSH <<EOF
	get -r ${PROD_STORE_PATH}/*
	exit
EOF

mv tajriba* ${DATA_PATH}
