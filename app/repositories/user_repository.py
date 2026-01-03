from app.models.user import User
from app.extensions import db

class UserRepository:

    @staticmethod
    def find_by_email(email):
        return User.query.filter_by(email=email).first()

    @staticmethod
    def save(user):
        db.session.add(user)
        db.session.commit()


    @staticmethod
    def get_by_id(user_id):
        return User.query.get(user_id)

    @staticmethod
    def update_profile(user_id, name, address):
        user = User.query.get(user_id)
        if not user:
            return
        user.name = name
        user.address = address
        db.session.commit()
