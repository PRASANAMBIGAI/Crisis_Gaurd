FROM python:3.11-slim

# Create a non-root user for Hugging Face Spaces (UID 1000)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

# Copy requirements from the server folder
COPY --chown=user server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY --chown=user . .

# Set environment variables for the FastAPI server
ENV HOST=0.0.0.0
ENV PORT=7860
ENV PYTHONPATH=$PYTHONPATH:$HOME/app
EXPOSE 7860

# Start the server from the root directory so it finds modules correctly
CMD ["uvicorn", "server.app:app", "--host", "0.0.0.0", "--port", "7860"]
