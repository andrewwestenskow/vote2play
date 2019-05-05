insert into user_login(email, password)
values($3, $6) returning user_login_id;

insert into users (firstname, lastname, email, favoritesong, image)
values($1, $2, $3, $4, $5) returning *;
