import startSession from "../support/session";

describe("Posts", () => {
  let session;

  beforeEach(async () => {
    session = await startSession();
    await page.setUserAgent(session.userAgent);
  });

  afterEach(async () => {
    await session.finish();
  });

  it("creates a post", async () => {
    await page.goto("http://localhost:4001");

    await expect(page).toFillForm(".Posts--form", {
      title: "My Post",
      content: "This is a post"
    });

    await expect(page).toClick('button[type="submit"]');
    await page.waitFor(".Post");
    await expect(page.$$(".Post")).resolves.toHaveLength(1);
  });

  it("updates a post", async () => {
    await session.call("post", {
      title: "Foo",
      content: "Bar"
    });

    await page.goto("http://localhost:4001");
    await page.waitFor(".Post");
    await expect(page).toClick("button", { text: "Edit" });
    await expect(page).toFillForm(".Posts--form", {
      title: "My Updated Post",
      content: "This is a post"
    });
    await expect(page).toClick('button[type="submit"]');

    await page.waitForFunction(
      `document.querySelector('.Post').textContent.match(/My Updated Post/) !== null`
    );
  });

  it("deletes a post", async () => {
    await session.call("post", {
      title: "Foo",
      content: "Bar"
    });

    await page.goto("http://localhost:4001");
    await page.waitFor(".Post");
    await expect(page).toClick("button", { text: "Delete" });
    await page.waitForFunction(
      `document.querySelectorAll('.Post').length === 1`
    );
  });
});
