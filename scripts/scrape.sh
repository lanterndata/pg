#!/bin/bash

# Function to get the current month in YYYYMM format
get_current_month() {
  date +%Y%m
}

# Function to get the last month in YYYYMM format
get_last_month() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # For macOS
    date -v-1m +%Y%m
  else
    # For Linux
    date -d "-1 month" +%Y%m
  fi
}

# Determine if --current-month flag is passed
month=""
if [ "$1" == "--current-month" ]; then
  month=$(get_current_month)
elif [ "$1" == "--last-month" ]; then
  month=$(get_last_month)
fi

# List of groups
groups=(
  pgsql-general
  pgsql-performance
  pgsql-hackers
  pgsql-admin
  pgsql-novice
  pgsql-sql
  pgsql-announce
  pgsql-docs
  pgsql-bugs
)

# Install dependencies, run migrations
yarn install
yarn dbmate up

# Load all data into data/ folder
if [ -z "$month" ]; then
  for group in "${groups[@]}"; do
    ./scripts/pgsql-lists-offline.sh -g "$group"
  done
  yarn scrape
else
  for group in "${groups[@]}"; do
    ./scripts/pgsql-lists-offline.sh -g "$group" -m "$month"
  done
  yarn scrape -m "$month"
fi