#!/bin/bash

set -e

echo "🚀 Starting Quick Prompt Box setup..."

# 1. Install Docker if not present
if ! [ -x "$(command -v docker)" ]; then
  echo "🔧 Docker is not installed. Installing Docker..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  rm -f get-docker.sh
else
  echo "✅ Docker is already installed."
fi

# 2. Clone the project (if needed)
if [ -d "quick-prompt-box" ]; then
  echo "📁 Existing 'quick-prompt-box' folder found. Removing it..."
  rm -rf quick-prompt-box
fi

echo "📥 Cloning the Quick Prompt Box project from GitHub..."
git clone https://github.com/mohammadrasoulasghari/quick-prompt-box.git
cd quick-prompt-box

# 3. Ask user for port
echo ""
echo "🌐 Port Configuration"
echo "Default port is 3131. You can change it or press Enter to use default."
read -p "Enter port number (default: 3131): " USER_PORT

# Set port (default to 3131 if not provided)
if [ -z "$USER_PORT" ]; then
  PORT=3131
  echo "Using default port: 3131"
else
  PORT=$USER_PORT
  echo "Using custom port: $PORT"
fi

# 4. Create .env file with user's port
echo "⚙️  Setting up environment..."
cat > .env << EOF
# Environment Variables
# Configure your application settings here

# Application port (default: 3131)
PORT=$PORT

# Host binding address (default: 0.0.0.0)
HOST=0.0.0.0
EOF

# 5. Build and run Docker container
echo "🐳 Building and starting the Docker container..."
PORT=$PORT docker compose up -d --build

# 6. Wait a moment for container to start
echo "⏳ Waiting for container to start..."
sleep 3

# 7. Final message
echo ""
echo "🎉 Quick Prompt Box is now running!"
echo "🌐 Open your browser and visit: http://localhost:$PORT"
echo ""
echo "📦 GitHub Repository: https://github.com/mohammadrasoulasghari/quick-prompt-box"
echo "👤 Created by Mohammadrasoul Asghari — https://mohammadrasoulasghari.ir"
echo ""
echo "📋 Useful commands:"
echo "   Stop:    docker compose down"
echo "   Restart: docker compose up -d"
echo "   Logs:    docker compose logs -f" 