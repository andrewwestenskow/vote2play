insert into "group" (name, joincode, require_admin_join, require_admin_song)
values ($1, $2, $3, $4) returning joincode, group_id;