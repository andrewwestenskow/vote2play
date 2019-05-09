delete from previously_played
where previously_played_id = $1;

insert into group_playlist (group_id, song_id, score)
values ($2, $3, 3);