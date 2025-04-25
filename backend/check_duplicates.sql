SELECT name, user_id, COUNT(*) as count
FROM projects
GROUP BY name, user_id
HAVING COUNT(*) > 1; 