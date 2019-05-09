select * from previously_played pp
join song s 
on pp.song_id = s.song_id
join "group" g
on pp.group_id = g.group_id
where pp.group_id = ($1)