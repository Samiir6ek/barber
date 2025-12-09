from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Telegram Bot Token from @BotFather
    BOT_TOKEN: str = "8253776569:AAHIlwh61jRNb7Uh4qm7QJLgGlJZrY51ALw"

    DATABASE_URL: str = "sqlite:///./sql_app.db"
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
