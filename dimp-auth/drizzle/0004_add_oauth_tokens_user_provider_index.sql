DROP INDEX "oauth_tokens_user_id_index";--> statement-breakpoint
CREATE INDEX "oauth_tokens_user_id_oauth_provider_index" ON "oauth_tokens" USING btree ("user_id","oauth_provider");