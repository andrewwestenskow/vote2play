select
  g.group_id,
  g.name,
  (
    select
      json_agg(playlist_item)
    from(
        select
          gp.group_playlist_id,
          gp.song_id,
          s.url,
          gp.score
        from
          "group" as g
          join group_playlist gp on g.group_id = gp.group_id
          join song s on gp.song_id = s.song_id
        where
          g.group_id = ($1)
          order by score desc
      ) as playlist_item
  ) as playlist,
  (
    select
      json_agg(previous_item)
    from(
        select
          pp.previously_played_id,
          pp.song_id,
          s.url
        from
          "group" as g
          join previously_played pp on g.group_id = pp.group_id
          join song s on pp.song_id = s.song_id
        where
          g.group_id = ($1)
      ) as previous_item
  ) as previously_played
from
  "group" g
where
  g.group_id = ($1)
