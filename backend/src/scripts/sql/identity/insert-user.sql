INSERT INTO identity.user (
  email,
  normalised_email,
  username,
  normalised_username,
  password,
)
VALUES ($1, $2, $3, $4, $5) RETURNING *;