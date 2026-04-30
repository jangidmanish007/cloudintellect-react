#!/bin/bash
# Start Cloud Intellect Backend Server
# Run this from the backend folder, or use: ./start-server.sh

cd "$(dirname "$0")"
echo "Starting backend server..."
echo "Port: ${PORT:-5002} (from .env or default)"
echo "---"
npm run dev
