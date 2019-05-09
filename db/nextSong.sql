delete from group_playlist
where group_playlist_id = ($1);

insert into previously_played(group_id, song_id)
values ($2, $3) returning *;