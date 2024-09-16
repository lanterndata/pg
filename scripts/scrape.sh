#!/bin/bash

# Function to get the previous month in YYYYMM format
get_previous_month() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS (BSD date)
    date -v-1m +%Y%m
  else
    # Linux (GNU date)
    date --date="$(date +%Y-%m-15) -1 month" +%Y%m
  fi
}

# Determine if --last-month flag is passed
month=""
if [ "$1" == "--last-month" ]; then
  month=$(get_previous_month)
fi

# List of groups
groups=(
  pgsql-general
  pgsql-performance
  pgsql-hackers
  pgsql-admin
  pgsql-novice
  pgsql-sql
  pgsql-testers
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