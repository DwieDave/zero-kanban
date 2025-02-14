CREATE DATABASE zstart;
CREATE DATABASE zstart_cvr;
CREATE DATABASE zstart_cdb;

\c zstart;

CREATE TABLE "user" (
  "id" VARCHAR PRIMARY KEY,
  "name" VARCHAR NOT NULL,
  "type" VARCHAR NOT NULL,
  "admin" BOOLEAN NOT NULL
);

CREATE TABLE "task" (
  "id" VARCHAR PRIMARY KEY,
  "assignee_id" VARCHAR REFERENCES "user"(id),
  "title" VARCHAR NOT NULL,
  "body" VARCHAR NOT NULL,
  "state" VARCHAR NOT NULL,
  "order" INTEGER NOT NULL,
  "timestamp" TIMESTAMP not null,
  "archived" TIMESTAMP
);

INSERT INTO "user" (id, name, type, admin) VALUES ('ycD76wW4R2', 'Aaron', 'teacher', false);
INSERT INTO "user" (id, name, type, admin) VALUES ('IoQSaxeVO5', 'Matt', 'teacher', false);
INSERT INTO "user" (id, name, type, admin) VALUES ('WndZWmGkO4', 'Cesar', 'janitor', false);
INSERT INTO "user" (id, name, type, admin) VALUES ('ENzoNm7g4E', 'Erik', 'teacher', false);
INSERT INTO "user" (id, name, type, admin) VALUES ('dLKecN3ntd', 'Greg', 'teacher', false);
INSERT INTO "user" (id, name, type, admin) VALUES ('enVvyDlBul', 'Darick', 'janitor', false);
INSERT INTO "user" (id, name, type, admin) VALUES ('9ogaDuDNFx', 'Alex', 'teacher', false);
INSERT INTO "user" (id, name, type, admin) VALUES ('6z7dkeVLNm', 'Dax', 'teacher', false);
INSERT INTO "user" (id, name, type, admin) VALUES ('7VoEoJWEwn', 'Nate', 'teacher', false);
