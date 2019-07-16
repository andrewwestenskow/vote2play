select firstname, lastname, users.email, favoritesong, image from users
join user_login
on users.email = user_login.email
where user_login.user_login_id = ($1)