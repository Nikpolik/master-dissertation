describe("Pages", () => {
  let randomPageName = "test_page_" + Math.floor(Math.random() * 1000);

  beforeEach(() => {
    cy.login();
    cy.visit("/pages");
  });

  it("Pages load", () => {
    cy.get("div[data-cy='pages-container']").should("exist");
    cy.get("div[data-cy='pages-card']").should("exist");
    cy.get("div[data-cy='pages-add-button']").should("exist");
  });

  it("Add page", () => {
    cy.createPage(randomPageName);
  });

  it("Edit Page", () => {
    cy.gotoPage(randomPageName);
  });

  it("Delete page", () => {
    cy.deletePage(randomPageName);
  });
});
