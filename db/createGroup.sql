insert into "group" (name, joincode, require_admin_join, require_admin_song, group_image)
values ($1, $2, $3, $4, $5) returning joincode, group_id;