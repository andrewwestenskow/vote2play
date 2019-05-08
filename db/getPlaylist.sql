select * from group_playlist gp
join "group" g
on gp.group_id = g.group_id
join song s 
on s.song_id = gp.song_id
where gp.group_id = $1;