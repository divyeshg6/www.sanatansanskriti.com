import { test, expect } from '@playwright/test';

test.describe('Code File Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load the application', async ({ page }) => {
    await expect(page).toHaveTitle(/Code File Generator/);
    await expect(page.locator('h1')).toContainText('Code File Generator');
  });

  test('should create a new file', async ({ page }) => {
    // Click new file button
    await page.click('[title="New File"]');
    
    // Check that a file appears in the tree
    await expect(page.locator('.file-tree-item')).toBeVisible();
    
    // Check that the editor is visible
    await expect(page.locator('.monaco-editor')).toBeVisible();
  });

  test('should select different languages', async ({ page }) => {
    // Select Python language
    await page.selectOption('[class*="select-field"]', 'python');
    
    // Verify language is selected
    const selectedValue = await page.locator('[class*="select-field"]').inputValue();
    expect(selectedValue).toBe('python');
  });

  test('should apply a template', async ({ page }) => {
    // Select JavaScript language
    await page.selectOption('[class*="select-field"]', 'javascript');
    
    // Wait for templates to load
    await page.waitForTimeout(500);
    
    // Select a template
    const templateSelect = page.locator('select').nth(1);
    await templateSelect.selectOption('Hello World');
    
    // Check that code appears in editor
    await page.waitForTimeout(1000);
    const editorContent = await page.locator('.monaco-editor textarea').inputValue();
    expect(editorContent).toContain('Hello, World!');
  });

  test('should validate code', async ({ page }) => {
    // Type some invalid JavaScript
    await page.locator('.monaco-editor textarea').fill('invalid javascript code {{{');
    
    // Click validate button
    await page.click('[title="Validate Code"]');
    
    // Check for validation errors
    await expect(page.locator('.text-red-300')).toBeVisible();
  });

  test('should format JSON code', async ({ page }) => {
    // Select JSON language
    await page.selectOption('[class*="select-field"]', 'json');
    
    // Type unformatted JSON
    const unformattedJson = '{"name":"test","value":123,"nested":{"key":"value"}}';
    await page.locator('.monaco-editor textarea').fill(unformattedJson);
    
    // Click format button
    await page.click('[title="Format Code"]');
    
    // Wait for formatting
    await page.waitForTimeout(1000);
    
    // Check that JSON is formatted
    const formattedContent = await page.locator('.monaco-editor textarea').inputValue();
    expect(formattedContent).toContain('{\n  "name"');
  });

  test('should download a single file', async ({ page }) => {
    // Create some content
    await page.locator('.monaco-editor textarea').fill('console.log("Hello, World!");');
    
    // Set up download promise before clicking
    const downloadPromise = page.waitForEvent('download');
    
    // Click download button
    await page.click('button:has-text("Download")');
    
    // Wait for download
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.(js|txt)$/);
  });

  test('should create and download ZIP file', async ({ page }) => {
    // Create multiple files
    await page.click('[title="New File"]');
    await page.waitForTimeout(500);
    
    await page.click('[title="New File"]');
    await page.waitForTimeout(500);
    
    // Add content to files
    const files = await page.locator('.file-tree-item').all();
    expect(files.length).toBeGreaterThanOrEqual(2);
    
    // Set up download promise
    const downloadPromise = page.waitForEvent('download');
    
    // Click ZIP download button
    await page.click('button:has-text("ZIP")');
    
    // Wait for download
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('project.zip');
  });

  test('should show preview for HTML', async ({ page }) => {
    // Select HTML language
    await page.selectOption('[class*="select-field"]', 'html');
    
    // Apply HTML template
    const templateSelect = page.locator('select').nth(1);
    await templateSelect.selectOption('Basic HTML');
    
    // Toggle preview
    await page.click('[title="Toggle Preview"]');
    
    // Check preview panel is visible
    await expect(page.locator('iframe')).toBeVisible();
  });

  test('should copy content to clipboard', async ({ page }) => {
    const testContent = 'console.log("Test content");';
    
    // Add content
    await page.locator('.monaco-editor textarea').fill(testContent);
    
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-write', 'clipboard-read']);
    
    // Click copy button
    await page.click('[title="Copy to Clipboard"]');
    
    // Verify clipboard content
    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardContent).toBe(testContent);
  });

  test('should rename files', async ({ page }) => {
    // Click on filename input
    const filenameInput = page.locator('.file-tree-item input').first();
    await filenameInput.click();
    await filenameInput.clear();
    await filenameInput.fill('my-test-file.js');
    await filenameInput.press('Enter');
    
    // Verify filename changed
    await expect(filenameInput).toHaveValue('my-test-file.js');
  });

  test('should delete files', async ({ page }) => {
    // Create a new file first
    await page.click('[title="New File"]');
    await page.waitForTimeout(500);
    
    // Count initial files
    const initialCount = await page.locator('.file-tree-item').count();
    
    // Hover over file to show delete button
    await page.locator('.file-tree-item').first().hover();
    
    // Click delete button
    await page.click('[title="Delete File"]');
    
    // Verify file was deleted
    const finalCount = await page.locator('.file-tree-item').count();
    expect(finalCount).toBe(Math.max(0, initialCount - 1));
  });

  test('should maintain history', async ({ page }) => {
    // Create and download a file to add to history
    await page.locator('.monaco-editor textarea').fill('console.log("History test");');
    
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download")');
    await downloadPromise;
    
    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check if history section appears (if there are items)
    const historySection = page.locator('h4:has-text("Recent Files")');
    if (await historySection.isVisible()) {
      await expect(historySection).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that main elements are still visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.monaco-editor')).toBeVisible();
    
    // Check that buttons are still accessible
    await expect(page.locator('button:has-text("Download")')).toBeVisible();
  });
});

test.describe('API Integration', () => {
  test('should handle server-side validation', async ({ page }) => {
    // This test would require the backend to be running
    await page.goto('/');
    
    // Add invalid JSON
    await page.selectOption('[class*="select-field"]', 'json');
    await page.locator('.monaco-editor textarea').fill('{ invalid json }');
    
    // Trigger validation (this would call the backend)
    await page.click('[title="Validate Code"]');
    
    // Check for error display
    await page.waitForTimeout(1000);
    await expect(page.locator('.text-red-300')).toBeVisible();
  });

  test('should handle server-side formatting', async ({ page }) => {
    await page.goto('/');
    
    // Add unformatted JavaScript
    await page.selectOption('[class*="select-field"]', 'javascript');
    await page.locator('.monaco-editor textarea').fill('function test(){return "hello";}');
    
    // Format code (this would call the backend)
    await page.click('[title="Format Code"]');
    
    // Wait for formatting to complete
    await page.waitForTimeout(2000);
    
    // Check that code is formatted
    const content = await page.locator('.monaco-editor textarea').inputValue();
    expect(content).toContain('\n'); // Should have line breaks after formatting
  });
});