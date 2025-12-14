from sqlalchemy import Column,Integer,String ,Float
from sqlalchemy.ext.declarative import declarative_base

Base=declarative_base()

class Product(Base):
    __tablename__ = "product"
    id=Column(Integer,primary_key=True,index=True)
    name=Column(String(100))
    description=Column(String(100))
    price=Column(Float)
    quantity=Column(Integer)



class Users(Base):
    __tablename__= "users"
    id=Column(Integer, primary_key=True, index=True)
    username=Column(String(100))
    email=Column(String(100), unique=True, index=True) 
    password=Column(String(255))    