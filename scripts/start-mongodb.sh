#!/bin/bash

# Check if MongoDB is running
if pgrep -x "mongod" > /dev/null
then
    echo "MongoDB is already running"
else
    echo "Starting MongoDB..."
    # Try to start MongoDB using the system service
    if command -v brew &> /dev/null
    then
        # macOS with Homebrew
        brew services start mongodb-community || brew services start mongodb
    elif command -v systemctl &> /dev/null
    then
        # Linux with systemd
        sudo systemctl start mongod
    elif command -v service &> /dev/null
    then
        # Linux with service
        sudo service mongod start
    else
        echo "Could not start MongoDB automatically. Please start it manually."
        exit 1
    fi
    
    echo "MongoDB started"
fi

# Create the database directory if it doesn't exist
mkdir -p ~/data/db

echo "MongoDB is ready to use" 