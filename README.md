# Paylocity Benefits Dashboard — Bug & Automation Challenge

## Setup
```bash
npm install
npx playwright install
```

## Environment Variables

Create a `.env` file in the project root:
```
AUTH_TOKEN="***"
USERNAME="***"
PASSWORD="***"
```

## Running Tests
```bash
# Run all tests
npx playwright test

# Run API tests only
npx playwright test --project=api

# Run UI tests only
npx playwright test --project=chromium
```

## Bug Report

See [GitHub Issues](https://github.com/karolat/Paylocity-Challenge/issues) for all identified defects.

## Test Results

A GitHub Actions workflow runs these tests and publishes the HTML report to GitHub Pages.

[Playwright Report (GitHub Pages)](https://karolat.github.io/Paylocity-Challenge/)
