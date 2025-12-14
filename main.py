from fastapi import Depends,FastAPI
from models import Product,UserCreate,UserLogin,Token
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from db import SessionLocal,engine
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
import db_models
from sqlalchemy.orm import Session


SECRET_KEY="123ABD43" 
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
db_models.Base.metadata.create_all(bind=engine)

@app.get("/")
def greet():
    return "Welcome to the FastApi" 


products=[
    Product(id=1,name="Laptop",description="Electronics",price=8000,quantity=2),
    Product(id=2,name="Smartphone",description="Electronics",price=5000,quantity=5),
    Product(id=3,name="Tablet",description="Electronics",price=3000,quantity=3)
]

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)



def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt    



def init_db():
    db=SessionLocal()
    count=db.query(db_models.Product).count()
    if count==0:
        for product in products:
            db.add(db_models.Product(**product.model_dump()))

        db.commit()    

    
init_db()


@app.get("/products")
def get_all_products(db:Session=Depends(get_db)):
    db_products=db.query(db_models.Product).all()

    return db_products




@app.get("/products/{id}")
def get_product_by_id(id:int,db:Session=Depends(get_db)):
    db_product=db.query(db_models.Product).filter(db_models.Product.id==id).first()
    if db_product:
        return db_product
    return "product not found"


@app.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user:UserCreate,db:Session=Depends(get_db)):
    db_user=db.query(db_models.Users).filter(db_models.Users.email==user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    password_hashed=get_password_hash(user.password)
    newUser=db_models.Users(
        username=user.username,
        email=user.email,
        password=password_hashed
    )
    db.add(newUser)
    db.commit()
    db.refresh(newUser)
    return {"message":"Account Created Successfully"}


@app.post("/login",response_model=Token)
def login(user:UserLogin,db:Session=Depends(get_db)):
    db_user=db.query(db_models.Users).filter(db_models.Users.email==user.email).first()
    if not db_user or not verify_password(user.password,db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    access_token=create_access_token(data={"sub": db_user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": db_user.username
    }    

    
@app.put("/ResetPassword", status_code=status.HTTP_200_OK)
def ResetPassword(user:UserCreate,db:Session=Depends(get_db)):
    db_user=db.query(db_models.Users).filter(db_models.Users.email==user.email).first()
    if db_user:
        hashed_password=get_password_hash(user.password)
        db_user.password=hashed_password
        db.commit()
        return {"message":"Password Reset Successfully"}
    else:
        raise HTTPException(status_code=404, detail="User not found")



@app.post("/products")
def add_product(product:Product,db:Session=Depends(get_db)):
    db.add(db_models.Product(**product.model_dump()))
    db.commit()
    return product


@app.put("/products/{id}")
def update_product(id:int,product:Product,db:Session=Depends(get_db)):
    db_product=db.query(db_models.Product).filter(db_models.Product.id==id).first()
    if db_product:
        db_product.name=product.name
        db_product.description=product.description
        db_product.price=product.price
        db_product.quantity=product.quantity
        db.commit()
        return "product updated successfully"
    
    else:
        return "product not found"        


@app.delete("/products/{id}")
def delete_product(id:int,product:Product, db:Session=Depends(get_db)):
    db_product=db.query(db_models.Product).filter(db_models.Product.id==id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
        return "Product Deleted Succcessfully"
    else:
        return "product not found"                   


    