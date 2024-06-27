# Use the official Python image from the Docker Hub
FROM python:3.12.0-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /code

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev build-essential

# Copy the requirements file into the container
COPY requirements.txt /code/

# Install dependencies individually for debugging
RUN pip install --upgrade pip
RUN while read requirement; do pip install $requirement --verbose; done < requirements.txt

# Copy the entire project into the container
COPY . /code/

# Expose the port the app runs on
EXPOSE 8000

# Run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
