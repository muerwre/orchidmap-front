#!/bin/bash
IP="37.192.131.144"
PORT=5000
PATH="./pbf/"
REGION="siberian-fed-district-latest"

while :
do
    osrm-routed -i $IP -p $PORT "$PATH/$REGION.osrm"
    sleep 600
done
