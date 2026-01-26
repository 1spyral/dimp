-- Custom SQL migration file, put your code below! --
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_oauth_tokens_updated_at
BEFORE UPDATE ON oauth_tokens
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
