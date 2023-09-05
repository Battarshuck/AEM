INSERT INTO identity.user_login (
  user_id
)
VALUES ($1) RETURNING *;