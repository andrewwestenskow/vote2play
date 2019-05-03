insert into user (firstname, lastname, email, favoritesong, image)
values(${firstname}, ${lastname}, ${email}, ${favoritesong}, ${image});

insert into user_login(email, hash)
values(${email}, ${hash});