
insert into users (firstname, lastname, email, favoritesong, image)
values($1, $2, $3, $4, 'https://s3-us-west-1.amazonaws.com/socialplaylists/Hero+Images/Default+user.png');

insert into user_login(email, password)
values($3, $5) returning user_login_id;



