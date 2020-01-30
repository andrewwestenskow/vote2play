with playlist_item as (
  select
    g.group_id,
    g.name,
    gp.group_playlist_id,
    gp.song_id,
    s.url,
    gp.score
  from
    "group" as g
    join group_playlist gp on g.group_id = gp.group_id
    join song s on gp.song_id = s.song_id 
),
previous_item as (
  select
    g.group_id,
    pp.previously_played_id,
    pp.song_id,
    s.url
  from
    "group" as g
    join previously_played pp on g.group_id = pp.group_id
    join song s on pp.song_id = s.song_id
)
select
  group_id,
  g.name,
  json_agg(DISTINCT playlist_item) playlist,
  json_agg(DISTINCT previous_item) old_playlist 
from
  playlist_item full
  join previous_item using (group_id)
  join "group" g using (group_id)
group by
  group_id,
  g.name 
