CREATE TRIGGER update_guilds_updated_at
BEFORE UPDATE ON guilds
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
