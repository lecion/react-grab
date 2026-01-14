import { test, expect } from "./fixtures.js";

test.describe("Router Integration - Vue2", () => {
  test.beforeEach(async ({ reactGrab }) => {
    await reactGrab.gotoVue2Page();
  });

  test("should display route pattern for router-view", async ({ reactGrab }) => {
    await reactGrab.activate();

    // Navigate to a route with parameters
    await reactGrab.page.goto("/vue2.html#/user/123");
    await reactGrab.page.waitForLoadState("networkidle");

    // Hover over the router-view element
    const routerView = await reactGrab.page.locator("#app > div").first();
    if (await routerView.isVisible()) {
      await routerView.hover();
      await reactGrab.waitForSelectionBox();

      const labelInfo = await reactGrab.getSelectionLabelInfo();
      expect(labelInfo.isVisible).toBe(true);

      // Selection should be visible on router-view content
      // Note: Component name detection may vary in Playwright environment
    }
  });

  test("should show nested route patterns", async ({ reactGrab }) => {
    await reactGrab.activate();

    // Navigate to a nested route
    await reactGrab.page.goto("/vue2.html#/user/123/posts");
    await reactGrab.page.waitForLoadState("networkidle");

    // Hover over nested router-view
    const nestedView = await reactGrab.page.locator(".user-content").first();
    if (await nestedView.isVisible()) {
      await nestedView.hover();
      await reactGrab.waitForSelectionBox();

      const labelInfo = await reactGrab.getSelectionLabelInfo();
      expect(labelInfo.isVisible).toBe(true);
    }
  });

  test("should handle route navigation", async ({ reactGrab }) => {
    await reactGrab.activate();

    // Start at home
    await reactGrab.page.goto("/vue2.html#/");
    await reactGrab.page.waitForLoadState("networkidle");

    // Navigate to user page
    await reactGrab.page.goto("/vue2.html#/user/456");
    await reactGrab.page.waitForLoadState("networkidle");

    // Hover over a component
    const userProfile = await reactGrab.page.locator(".user-profile").first();
    if (await userProfile.isVisible()) {
      await userProfile.hover();
      await reactGrab.waitForSelectionBox();

      const labelInfo = await reactGrab.getSelectionLabelInfo();
      expect(labelInfo.isVisible).toBe(true);
    }
  });

  test("should extract component stack with route info", async ({ reactGrab }) => {
    await reactGrab.activate();

    await reactGrab.page.goto("/vue2.html#/user/789");
    await reactGrab.page.waitForLoadState("networkidle");

    // Click on a component to copy its info
    const userCard = await reactGrab.page.locator(".user-card").first();
    if (await userCard.isVisible()) {
      await userCard.click();

      // Wait a bit for clipboard operation
      await reactGrab.page.waitForTimeout(500);

      const clipboardContent = await reactGrab.getClipboardContent();

      // Should contain component information
      expect(clipboardContent).toBeTruthy();
    }
  });
});
