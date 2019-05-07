insert into group_member (group_id, users_id)
values($1, $2) returning group_member_id;