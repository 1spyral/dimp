-- Custom SQL migration file, put your code below! --
CREATE TRIGGER update_oauth_refresh_tokens_updated_at
    BEFORE UPDATE ON oauth_refresh_tokens
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();