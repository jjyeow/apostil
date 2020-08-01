from models.base_model import BaseModel
import peewee as pw
import re
from werkzeug.security import generate_password_hash


class User(BaseModel):
    username = pw.CharField(unique=True)
    first_name = pw.CharField(unique=False, null=True)
    last_name = pw.CharField(unique=False, null=True)
    password = pw.CharField(unique=False)
    email = pw.CharField(unique=True)
    hp_number = pw.CharField(unique=True)

    def validate(self):
        if self.username = "":
            self.errors.append('Username cannot be empty!')
        
        if self.hp_number = "":
            self.errors.append("Mobile phone number cannot be empty")

        hp_duplicate = User.get_or_none(User.hp_number == self.hp_number)
        if hp_duplicate:
            self.errors.append("Mobile phone number has been used")
        
        email_duplicate = User.get_or_none(User.email == self.email)
        if email_duplicate:
            self.errors.append("Email has been used")
        
        username_duplicate = User.get_or_none(User.username == self.username)
        if username_duplicate:
            self.errors.append("Username has been used")

        if re.search('[A-Za-z0-9._%+-]+@+[A-Za-z]+[.]+[c][o][m]', self.email) is None:
            self.errors.append('Invalid email')
        if len(self.password) < 6:
            self.errors.append("Password has to be at least 6 characters")
        elif re.search('[A-Z]', self.password) is None: 
            self.errors.append("Password must have at least 1 capital letter")
        elif re.search('[0-9]', self.password) is None:
            self.errors.append("Password must have at least 1 digit number")
        elif re.search('[a-z]', self.password) is None: 
            self.errors.append("Password must have at least 1 lower-case letter")
        elif re.search("[$&+,_:;=?@#\"\\/|'<>.^*()%!-]", self.password) is None:
            self.errors.append("Password must have at least 1 special character")

        self.password = generate_password_hash(self.password)

