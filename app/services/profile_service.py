from app.repositories.user_repository import UserRepository

class ProfileService:

    @staticmethod
    def get_user_profile(user_id):
        return UserRepository.get_by_id(user_id)

    @staticmethod
    def update_profile(user_id, name, address):
        UserRepository.update_profile(user_id, name, address)
