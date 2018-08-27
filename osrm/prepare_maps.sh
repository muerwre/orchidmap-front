#!/bin/bash
REGION="russia";
DISTRICT="siberian-fed-district-latest";

mkdir pbf
wget "https://download.geofabrik.de/$REGION/$DISTRICT.osm.pbf" -O "pbf/$DISTRICT.osm.pbf"

osrm-extract "./pbf/$DISTRICT.osm.pbf" -p ./rules.lua
osrm-contract "./pbf/$DISTRICT.osrm"
