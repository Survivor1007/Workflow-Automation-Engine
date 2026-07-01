# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies 
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


# Copy backend code
COPY . .

# EXPOSE FastAPI port 
EXPOSE 8000

# Run 
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]


