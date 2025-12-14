from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine


database_url = "mysql+pymysql://root:@localhost:3306/telusko"

engine=create_engine(database_url)

SessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine)