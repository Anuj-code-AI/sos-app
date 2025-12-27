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
