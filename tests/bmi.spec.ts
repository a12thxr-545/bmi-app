import { test, expect } from '@playwright/test';

const generateUser = () => {
  const timestamp = Date.now();
  return {
    name: `Test User ${timestamp}`,
    email: `test${timestamp}@example.com`,
    password: 'password123',
  };
};

test.describe('BMI Application Tests', () => {
  
  test('1. User Registration', async ({ page }) => {
    const user = generateUser();
    
    await page.goto('/register');
    await page.fill('input[placeholder="Full Name"]', user.name);
    await page.fill('input[type="email"]', user.email);
    await page.fill('input[placeholder="••••••••"] >> nth=0', user.password);
    await page.fill('input[placeholder="••••••••"] >> nth=1', user.password);
    
    await page.click('button:has-text("Sign Up")');
    
    // Expect success message or redirection
    await expect(page.locator('.alert-success')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.alert-success')).toContainText('Registration successful');
    
    // Should redirect to login after 2 seconds
    await page.waitForURL('**/login', { timeout: 10000 });
  });

  test('2. User Login', async ({ page }) => {
    const user = generateUser();
    
    // Register first
    await page.goto('/register');
    await page.fill('input[placeholder="Full Name"]', user.name);
    await page.fill('input[type="email"]', user.email);
    await page.fill('input[placeholder="••••••••"] >> nth=0', user.password);
    await page.fill('input[placeholder="••••••••"] >> nth=1', user.password);
    await page.click('button:has-text("Sign Up")');
    await page.waitForURL('**/login');
    
    // Now Login
    await page.fill('input[type="email"]', user.email);
    await page.fill('input[type="password"]', user.password);
    await page.click('button:has-text("Login")');
    
    // Expect redirection to dashboard
    await page.waitForURL('**/dashboard');
    await expect(page.locator('h1')).toContainText('Hello');
  });

  test('3. Calculate BMI', async ({ page }) => {
    const user = generateUser();
    
    // Register and Login
    await page.goto('/register');
    await page.fill('input[placeholder="Full Name"]', user.name);
    await page.fill('input[type="email"]', user.email);
    await page.fill('input[placeholder="••••••••"] >> nth=0', user.password);
    await page.fill('input[placeholder="••••••••"] >> nth=1', user.password);
    await page.click('button:has-text("Sign Up")');
    await page.waitForURL('**/login');
    
    await page.fill('input[type="email"]', user.email);
    await page.fill('input[type="password"]', user.password);
    await page.click('button:has-text("Login")');
    await page.waitForURL('**/dashboard');
    
    // Go to BMI page
    await page.goto('/bmi');
    
    // Fill BMI form
    await page.fill('input[placeholder="e.g. 65.5"]', '70');
    await page.fill('input[placeholder="e.g. 170"]', '175');
    await page.click('button:has-text("Save and Calculate BMI")');
    
    // Expect result
    // BMI = 70 / (1.75 * 1.75) = 22.86
    await expect(page.locator('.bmi-value')).toBeVisible();
    await expect(page.locator('.bmi-value')).toContainText('22.86');
    await expect(page.locator('.bmi-category')).toContainText('Normal');
  });

  test('4. View History', async ({ page }) => {
    const user = generateUser();
    
    // Register and Login
    await page.goto('/register');
    await page.fill('input[placeholder="Full Name"]', user.name);
    await page.fill('input[type="email"]', user.email);
    await page.fill('input[placeholder="••••••••"] >> nth=0', user.password);
    await page.fill('input[placeholder="••••••••"] >> nth=1', user.password);
    await page.click('button:has-text("Sign Up")');
    await page.waitForURL('**/login');
    
    await page.fill('input[type="email"]', user.email);
    await page.fill('input[type="password"]', user.password);
    await page.click('button:has-text("Login")');
    await page.waitForURL('**/dashboard');
    
    // Calculate BMI first to have history
    await page.goto('/bmi');
    await page.fill('input[placeholder="e.g. 65.5"]', '80');
    await page.fill('input[placeholder="e.g. 170"]', '180');
    await page.click('button:has-text("Save and Calculate BMI")');
    await expect(page.locator('.bmi-value')).toBeVisible();
    
    // Go to History page
    await page.goto('/history');
    
    // Verify history table contains the record
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('td', { hasText: '24.69' })).toBeVisible(); // 80 / 1.8^2 = 24.69
  });

  test('5. Access Control (Protected Routes)', async ({ page }) => {
    // Ensure no session
    await page.context().clearCookies();
    
    // Try to access protected page
    await page.goto('/bmi');
    
    // Should be redirected to login
    await expect(page).toHaveURL(/.*\/login/);
    
    // Try another one
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*\/login/);
  });
});
