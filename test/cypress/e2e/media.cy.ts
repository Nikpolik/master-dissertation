describe("Media", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/media");
  });

  it("Loads", () => {
    cy.url().should("include", "/media");
  });

  it("Creates a new media file", () => {
    cy.get("div[data-cy='media-container']").should("exist");
    cy.get("button[data-cy='media-create-button']").should("exist").click();
    cy.get("[name='name']").should("exist").type("Test Media");
    cy.get("textarea[name='description']")
      .should("exist")
      .type("Test Media Description");
    cy.get("[type='file']")
      .should("exist")
      .selectFile("./cypress/fixtures/image.jpg", { force: true });
    cy.get("[type='submit']").should("exist").click();
    cy.get("div[data-cy='media-card']").contains("Test Media").should("exist");
  });

  it("Edits a media", () => {
    cy.contains("Test Media")
      .should("exist")
      .closest("[data-cy='media-card']")
      .should("exist")
      .find("[data-cy='media-edit-button']")
      .click();
    cy.get("[name='name']").should("exist").clear().type("Test Media Edited");
    cy.get("textarea[name='description']")
      .should("exist")
      .clear()
      .type("Test Media Description Edited");
    cy.get("[type='submit']").should("exist").click();
    cy.wait(2000);
    cy.get("div[data-cy='media-card']")
      .contains("Test Media Description Edited")
      .should("exist");
    cy.get("div[data-cy='media-card']")
      .contains("Test Media Description Edited")
      .should("exist");
  });

  it("Deletes a media file", () => {
    cy.contains("Test Media")
      .should("exist")
      .closest("[data-cy='media-card']")
      .should("exist")
      .find("[data-cy='media-delete-button']")
      .click();
    cy.contains("Yes").click();
    cy.get("div[data-cy='media-card']").should("not.exist");
  });
});
