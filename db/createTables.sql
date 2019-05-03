create table "user" (
  "user_id" serial primary key,
  "firstname" varchar,
  "lastname" varchar,
  "email" varchar unique,
  "favoritesong" text,
  "image" text
);


