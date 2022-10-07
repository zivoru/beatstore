# [BeatStore](https://beatstorez.ru)

Музыкальный маркетплейс для покупки и продажи битов

## Стек технологий
**В проекте используются**:

* Backend:
  - Java 17
  - Maven
  - Spring Boot
  - Spring Web
  - Spring Data
  - Spring JPA
  - Spring OAuth2
  - Spring Session
  - GIT
  - REST
  - Swagger
  - Lombok
  - Stream API
* SQL:
  - PostgreSQL
  - Liquibase
  - Docker
* Frontend:
  - CSS
  - HTML
  - JavaScript
  - Node.js
  - Webpack
  - React
  - axios

## Запуск

**Для запуска нужно:**
- Клонировать проект в среду разработки
- Прописать properties в файле **[application-dev.properties](src/main/resources/application-dev.properties)** 
- Запустить **[Docker](https://www.docker.com)**, 
- Запустить **[docker-compose.yml](docker/docker-compose.yml)**, 
- Запустить метод **main** в файле **[BeatstoreApplication.java](src/main/java/ru/zivo/beatstore/BeatstoreApplication.java)**

После выполнения всех действий сайт будет доступен по ссылке http://localhost:7777 и Swagger по [ссылке](http://localhost:7777/swagger-ui/index.html#).

## Ссылки
- [***BeatStore***](https://beatstorez.ru)
- [***Frontend***](https://github.com/zivoru/BeatStore-Frontend)