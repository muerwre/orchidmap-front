# Bicycle routes map editor
Bicycle routes app with automatic routes, map screenshots, stickers and other features.

## Prerequisites
node, osrm-server

### Installing 
First, download and install the project
```
git clone https://github.com/muerwre/orchidMap.git
cd orchidMap
npm i
```

### Setting up OSRM
Install OSRM server as written here: https://github.com/Project-OSRM/osrm-backend

Specify country and region in osrm/prepare_maps.sh or download .pbf file from https://download.geofabrik.de/ manually.
After starting ./prepare_maps you'll get parsed .osrm files for Open Source Routing Machine server.

Next you need to edit start_server.sh to specify address, port for server and path to parsed files.

After that run start_server.sh in screen or by the way you feel comfortable.

Next edit ```./src/config.js``` and specify OSRM url there. By default, OSRM starts at ```http://localhost:5000/```

### Frontend
Configs are placed in ```./src/config.js``` and ```./src/constants/```


For development launch ```npm start``` and visit ```http://localhost:8000/```

For production launch ```npm build```, the output will be placed at ```./dist``` folder, you should configure your http server to serve index html from that folder.

### Backend
Take a look at ```./backend/config/``` files, especially at ```db.js```. Your api server will be spawned at ```http://localhost:3000/```

For development launch ```npm serve-dev```, it will launch dev server, reloading on every code update

For production launch ```npm serve``` and make it running in background by any desireable way, such as ```forever```
