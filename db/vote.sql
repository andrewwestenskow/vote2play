update group_playlist
set score = $1
where group_playlist_id = $2
returning *;