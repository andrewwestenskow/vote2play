update users 
set firstname = $2, lastname = $3, favoritesong = $4, image= $5
where user_id = $1;

select * from users where user_id = $1