from sqlalchemy import Column, Integer, String, text
from sqlalchemy.orm import Mapped, relationship
from typing import TYPE_CHECKING

from app.core import security
from app.models.common import DateTimeModelMixin
from app.models.rwmodel import RWModel

if TYPE_CHECKING:
    from app.models.comment import Comment


class User(RWModel, DateTimeModelMixin):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        server_default=text("nextval('users_id_seq'::regclass)"),
    )
    username = Column(String(32), nullable=False, unique=True)
    email = Column(String(256), nullable=False, unique=True)
    salt = Column(String(255), nullable=False)
    hashed_password = Column(String(256), nullable=True)
    comments: Mapped[list["Comment"]] = relationship(back_populates="created_by")

    def check_password(self, password: str) -> bool:
        return security.verify_password(self.salt + password, self.hashed_password)

    def change_password(self, password: str) -> None:
        self.salt = security.generate_salt()
        self.hashed_password = security.get_password_hash(self.salt + password)
