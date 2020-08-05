from models.base_model import BaseModel
import peewee as pw
from models.user import User
import datetime
from datetime import date, timedelta
import calendar

def add_days(sourcedate, days):
    delta = timedelta(days)
    return sourcedate + delta

def add_weeks(sourcedate, weeks):
    delta = timedelta(7*weeks)
    return sourcedate + delta

def add_months(sourcedate, months):
    month = sourcedate.month - 1 + months
    year = sourcedate.year + month // 12
    month = month % 12 + 1
    day = min(sourcedate.day, calendar.monthrange(year,month)[1])
    return datetime.date(year, month, day)

def add_years(sourcedate, years):
    try:
        return sourcedate.replace(year = sourcedate.year + years)
    except ValueError:
        return sourcedate + (date(sourcedate.year + years, 3 , 1) - date(sourcedate.year, 3,1))

class Subscription(BaseModel):
    user = pw.ForeignKeyField(User, backref="subscription", on_delete="CASCADE", unique=False)
    name = pw.CharField(unique=False)
    description = pw.CharField(unique=False, null=True)
    amount = pw.DecimalField(max_digits=15, decimal_places=2, null=True)
    payment_date = pw.DateField(unique=False)
    subs_type = pw.CharField(unique=False) #Daily, Weekly, Monthly, Yearly
    frequency = pw.IntegerField(unique=False)
    paid = pw.BooleanField(default=False)
    next_payment = pw.DateField(unique=False)
    due = pw.BooleanField(default=False)

    def validate(self):
        if self.subs_type == "daily": 
            self.next_payment = add_days(self.payment_date, self.frequency)

        elif self.subs_type == "weekly":
            self.next_payment = add_weeks(self.payment_date, self.frequency)

        elif self.subs_type == "monthly":
            self.next_payment = add_months(self.payment_date, self.frequency)

        elif self.subs_type == "yearly":
            self.next_payment = add_years(self.payment_date, self.frequency)
