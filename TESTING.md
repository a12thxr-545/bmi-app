# Testing Plan for BMI Application

This document outlines the testing strategy for the BMI application using Playwright.

## Test Scope

The following critical user flows will be tested:

1.  **User Registration**
    - **Goal**: Verify that a new user can successfully create an account.
    - **Steps**: Navigate to register page -> Fill form -> Submit -> Verify redirection to login/dashboard.

2.  **User Login**
    - **Goal**: Verify that a registered user can log in.
    - **Steps**: Navigate to login page -> Fill credentials -> Submit -> Verify redirection to dashboard.

3.  **BMI Calculation**
    - **Goal**: Verify that the BMI calculator computes and displays the correct result.
    - **Steps**: Login -> Navigate to BMI page -> Input height and weight -> Calculate -> Verify result display.

4.  **View History**
    - **Goal**: Verify that past BMI calculations are saved and displayed.
    - **Steps**: Login -> Navigate to History page -> Verify presence of previous calculation records.

5.  **Access Control (Protected Routes)**
    - **Goal**: Verify that unauthenticated users are redirected from protected pages.
    - **Steps**: Try to access `/dashboard` or `/bmi` without logging in -> Verify redirection to `/login`.

## Tools

-   **Framework**: Playwright
-   **Environment**: Local (localhost:3000)

## Execution

Tests will be located in the `tests/` directory and can be run using `npx playwright test`.
