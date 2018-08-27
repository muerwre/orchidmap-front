# Bicycle routes map editor
Bicycle routes app with automatic routes, map screenshots, stickers and other features.

## Prerequisites
npm, php, imagemagick, osrm-server

### Installing frontend
First, download and install the project
```
git clone https://github.com/muerwre/orchidMap.git
cd orchidMap
npm i
npm start
```

### Setting up OSRM
Install OSRM server as written here: https://github.com/Project-OSRM/osrm-backend

Specify country and region in osrm/prepare_maps.sh or download .pbf file from https://download.geofabrik.de/ manually.
After starting ./prepare_maps you'll get parsed .osrm files for Open Source Routing Machine server.

Next you need to edit start_server.sh to specify address, port for server and path to parsed files.
After that run start_server.sh in screen or by the way you feel comfortable.

### Configuring backend

Comming soon...

