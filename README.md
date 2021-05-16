# arowana

How to start:
docker-compose up --build

load data via python script
1. python - (py2.x/3.x)
2. Require to install pip package "requests"
    pip install requests
3. execute data load script
    python src/dataGenerator/data_gen.py

load data via API
1. invoke post API `http://localhost:6000/generate/ticket?` with params req

invoke APIs - open API in postman
1. import "src/postman_api_docs/ticket_apis.postman_collection.json" file in postman
2. will be able to test all the APIs


Authentication and Authorization
1. Both are provided only to API  "/getalldocs"
2. user list and details are specified in file `src/app.js` variable named "users"


Route files
1. Route files is under "src/routes/"

model files
1. model files is found under "src/model/"

db operarations
1. DB ops file is under "src/db"

swagger documentation
1. API documentation YAML file stored under "src/swagger/" folder

Ticket schema
1. schema strutures are stored in "src/schema/" folder

Docker file of mongoBD
1. path  "/arowana/mongoDb/Dockerfile"

Docker file of backend 
1. path "/arowana/Dockerfile"

Docker compose file
1. path "arowana/docker-compose.yml"


CMD "docker-compose up" will invoke "docker-compose" file which uses the docker file of mongodb and backend, to make those service up


Things to know about Docker

startes every service
docker-compose up

demon mode
docker-compose up -d 

stop/remove
docker-compose down 

stop
docker-compose stop

start
docker-compose start

to create number of service
docker-compose up --scale <servicename>=number

eg: docker-compose up --scale backend=5


