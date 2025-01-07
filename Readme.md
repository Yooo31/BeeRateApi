docker-compose down
docker-compose build
docker-compose up -d

docker exec -it beerateapi-api-1 sh

npx ts-node src/db/migrations.ts
