# [BeatStore](https://beatstorez.ru)

Музыкальный маркетплейс для покупки и продажи битов

## Стек технологий

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
* Tests:
  - JUnit 5
  - Mockito
  - AssertJ
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
1. Клонировать проект в среду разработки
2. Для авторизации с помощью **OAuth2** через Google нужно создать проект на сайте https://console.cloud.google.com/projectcreate и настроить **OAuth 2.0 Client IDs** в разделе **Credentials**
3. Добавить следующие переменные среды:

| name                           | value                                                   |
|--------------------------------|---------------------------------------------------------|
| BEATSTORE_GOOGLE_CLIENT_ID     | client_id который вы получили при выполнении шага 2     |
| BEATSTORE_GOOGLE_CLIENT_SECRET | client_secret который вы получили при выполнении шага 2 |
| BEATSTORE_UPLOAD_PATH          | путь до места где будут храниться файлы пользователей   |

4. Запустить **[Docker](https://www.docker.com)**
5. Запустить **[docker-compose.yml](docker/docker-compose.yml)**
6. Запустить метод **main** в файле **[BeatstoreApplication.java](src/main/java/ru/zivo/beatstore/BeatstoreApplication.java)**

После выполнения всех действий сайт будет доступен по ссылке http://localhost:7777 и Swagger по [ссылке](http://localhost:7777/swagger-ui/index.html#).

## Ссылки
- [***BeatStore***](https://beatstorez.ru)
- [***Frontend***](https://github.com/zivoru/BeatStore-Frontend)