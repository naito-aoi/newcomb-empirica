#!/bin/bash
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")/../" ; pwd -P )
cd "$parent_path"

# Load dotenv
export $(cat .env | xargs)

empirica bundle

echo $SERVER_SSH;
echo $SERVER_PATH;
echo $SERVER_PEM;

if [ "$1" == "--full" ] 
then
	sftp -b - -i deployment/$SERVER_PEM $SERVER_SSH <<EOF
		put -r "$parent_path/$EXPERIMENT_NAME.tar.zst" "$SERVER_PATH"
		put "$parent_path/start.sh" "$SERVER_PATH/start.sh"
		put "$parent_path/.env_prod" "$SERVER_PATH/.env"
		put -r "$parent_path/client/public" "$SERVER_PATH/client"
		exit
EOF
else
	sftp -b - -i deployment/$SERVER_PEM $SERVER_SSH <<EOF
		put -r "$parent_path/$EXPERIMENT_NAME.tar.zst" "$SERVER_PATH"
		put "$parent_path/start.sh" "$SERVER_PATH/start.sh"
		put "$parent_path/.env_prod" "$SERVER_PATH/.env"
		exit
EOF
fi

echo "Done deploying the experiment!";