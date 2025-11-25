#!/bin/bash

if test -f RUNNING_PID
then
kill `cat RUNNING_PID`
fi

echo $$ > RUNNING_PID

current_dir=$(pwd)
dt=$(date +%F)
pid3=0  # API serverのPID用の初期化

# Load .env variables
set -a            
source .env
set +a

# Finished loading, start running
echo "Running Empirica in '${DEPLOYMENT}' mode"

# Run Empirica
if [ "$DEPLOYMENT" == "dev" ]
then
    { empirica -s ":${PORT_EMPIRICA}" & }
    pid1=$!
    echo "Empirica running with PID $pid1";
else
    { empirica serve "${EXPERIMENT_NAME}.tar.zst" -s ":${PORT_EMPIRICA}" --tajriba.store.file "${STORE_PATH}/tajriba-${dt}.json" > "$current_dir/log_empirica.log" 2>&1 & }
    pid1=$!
    echo "Empirica running with PID $pid1";
fi

# Run API server
# cd "$current_dir/server"
npm run start:api 1> "$current_dir/log_api.log" 2>&1 &
pid3=$!
echo "API server running with PID $pid3";
# cd "$current_dir"

# Stop all child processes when we stop this script
function cleanup()
{
    kill -9 $pid1 $pid3;
    echo "$pid1 and $pid3 stopped";
    rm log_*
    rm RUNNING_PID
    echo ''
    echo "Bye bye!"
}

# Keep script open until an interrupt is sent
# trap cleanup SIGINT
 trap cleanup EXIT
wait