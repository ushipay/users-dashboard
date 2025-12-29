from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DB_URL = "sqlite:///./app.db"

engine = create_engine(url=DB_URL, connect_args={"check_same_thread": False}, echo=True)
sessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
