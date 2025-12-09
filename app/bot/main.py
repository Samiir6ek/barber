import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    filters,
    ContextTypes,
    ConversationHandler,
)
from app.core.config import settings
import httpx  # For making HTTP requests to our FastAPI backend

# Enable logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

# States for the registration conversation
REGISTER_NAME, REGISTER_PHONE = range(2)

# --- Helper function to create the web app button ---
def get_webapp_keyboard() -> InlineKeyboardMarkup:
    """Creates an inline keyboard with a button to launch the web app."""
    keyboard = [
        [
            InlineKeyboardButton(
                "🗓️ Book an Appointment",
                web_app=WebAppInfo(url="https://your-frontend-url.vercel.app") # Placeholder URL
            )
        ]
    ]
    return InlineKeyboardMarkup(keyboard)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Sends a welcome message and initiates registration or main menu."""
    user_id = update.effective_user.id

    # Check if user is already registered via API
    async with httpx.AsyncClient() as client:
        try:
            # NOTE: We are using a placeholder for the backend URL for now
            response = await client.get(f"http://localhost:8000/users/{user_id}")
            response.raise_for_status()  # Raise an exception for 4xx/5xx responses
            
            # User found, they are already registered
            await update.message.reply_text(
                f"Welcome back, {response.json()['name']}! Ready to book your appointment?",
                reply_markup=get_webapp_keyboard()
            )
            return ConversationHandler.END # End conversation if user is registered
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                # User not found, proceed with registration
                pass
            else:
                logger.error(f"Error checking user registration: {e}")
                await update.message.reply_text("An error occurred. Please try again later.")
                return ConversationHandler.END
        except httpx.RequestError as e:
            logger.error(f"Network error checking user registration: {e}")
            await update.message.reply_text("A network error occurred. Please try again later.")
            return ConversationHandler.END

    # If not registered, start registration flow
    await update.message.reply_text(
        "Welcome to The Gents' Chair! To help us book your appointment, please tell us your full name."
    )
    context.user_data['telegram_id'] = user_id
    return REGISTER_NAME


async def register_name(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Captures the user's name during registration."""
    user_name = update.message.text
    if not user_name:
        await update.message.reply_text("Please provide your name.")
        return REGISTER_NAME
    
    context.user_data['name'] = user_name
    await update.message.reply_text(
        f"Thanks, {user_name}! Now, please share your contact phone number."
    )
    return REGISTER_PHONE


async def register_phone(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Captures the user's phone number and completes registration."""
    phone_number = update.message.text
    if not phone_number:
        await update.message.reply_text("Please provide your phone number.")
        return REGISTER_PHONE

    telegram_id = context.user_data.get('telegram_id')
    name = context.user_data.get('name')

    if not telegram_id or not name:
        await update.message.reply_text("Something went wrong with your registration. Please try /start again.")
        context.user_data.clear()
        return ConversationHandler.END

    # Send data to FastAPI backend
    user_data = {
        "telegram_id": telegram_id,
        "name": name,
        "phone_number": phone_number
    }

    async with httpx.AsyncClient() as client:
        try:
            # NOTE: We are using a placeholder for the backend URL for now
            response = await client.post("http://localhost:8000/users/", json=user_data)
            response.raise_for_status()  # Raise an exception for 4xx/5xx responses
            
            await update.message.reply_text(
                f"✅ Perfect, {name}! You're all set. You can now book an appointment.",
                reply_markup=get_webapp_keyboard()
            )
            context.user_data.clear()  # Clear temporary data
            return ConversationHandler.END # End conversation
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 400 and "User already registered" in e.response.text:
                await update.message.reply_text(
                    "It looks like you're already registered! Ready to book your appointment?",
                    reply_markup=get_webapp_keyboard()
                )
            else:
                logger.error(f"Error registering user: {e}")
                await update.message.reply_text("An error occurred during registration. Please try again later.")
        except httpx.RequestError as e:
            logger.error(f"Network error during registration: {e}")
            await update.message.reply_text("A network error occurred during registration. Please try again later.")
    
    context.user_data.clear()
    return ConversationHandler.END


async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Cancels and ends the conversation."""
    await update.message.reply_text(
        "Registration cancelled. You can start again with /start."
    )
    context.user_data.clear()
    return ConversationHandler.END


def main() -> None:
    """Start the bot."""
    # Create the Application and pass it your bot's token.
    application = Application.builder().token(settings.BOT_TOKEN).build()

    # Setup the conversation handler for registration
    conv_handler = ConversationHandler(
        entry_points=[CommandHandler("start", start)],
        states={
            REGISTER_NAME: [MessageHandler(filters.TEXT & ~filters.COMMAND, register_name)],
            REGISTER_PHONE: [MessageHandler(filters.TEXT & ~filters.COMMAND, register_phone)],
        },
        fallbacks=[CommandHandler("cancel", cancel)],
    )

    application.add_handler(conv_handler)

    # Run the bot until the user presses Ctrl-C
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()