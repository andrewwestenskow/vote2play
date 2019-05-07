select users.user_id, group_member.group_id, joincode from group_member
join users
on group_member.users_id = users.user_id
join "group"
on group_member.group_id = "group".group_id
where users.user_id = $1