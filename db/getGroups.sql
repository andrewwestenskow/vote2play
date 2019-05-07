select name, group_member.group_id, joincode, require_admin_join, require_admin_song, group_image  from "group" 
join group_member
on "group".group_id = group_member.group_id
where group_member.users_id = $1;