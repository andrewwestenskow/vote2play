insert into group_member (group_id, users_id, ishost)
values($1, $2, $3) returning group_member_id;