from werkzeug.security import generate_password_hash, check_password_hash
from app.models.user import User
from app.repositories.user_repository import UserRepository

class AuthService:

    @staticmethod
    def register_user(name, email, password):
        existing_user = UserRepository.find_by_email(email)
        if existing_user:
            return False, "User already exists"

        hashed_password = generate_password_hash(password)

        user = User(
            name=name,
            email=email,
            password=hashed_password
        )

        UserRepository.save(user)
        return True, "User registered successfully"

    @staticmethod
    def login_user(email, password):
        user = UserRepository.find_by_email(email)
        if not user:
            return False, "User not found"

        if not check_password_hash(user.password, password):
            return False, "Invalid password"

        return True, user
