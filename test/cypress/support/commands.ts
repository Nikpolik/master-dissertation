// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
//

Cypress.Commands.add("login", () => {
  cy.session("auth", () => {
    cy.auth("testtest", "test");
    cy.url().should("include", "/pages");
  });
});

Cypress.Commands.add("auth", (username, password) => {
  cy.visit("/");
  cy.url().should("include", "/login");
  const nameField = cy.get("input[name='name']");
  const passwordField = cy.get("input[name='password']");
  const submitButton = cy.get("button[type='submit']");

  nameField.type(username);
  passwordField.type(password);
  submitButton.click();
});

Cypress.Commands.add("gotoPage", (name: string) => {
  cy.visit("/pages");
  const $text = cy.contains(name).should("exist");
  const $card = $text.closest("[data-cy='pages-card']").should("exist");
  $card.find("[data-cy='pages-edit-button']").click();
  cy.url().should("include", "/edit");
});

Cypress.Commands.add("createPage", (name: string) => {
  cy.visit("/pages");
  cy.get("div[data-cy='pages-add-button']").click();
  const $namefield = cy.get("[name='name']");
  const $descriptionfield = cy.get("[data-cy='description']");
  const description = `${name} - description`;
  $namefield.type(name);
  $descriptionfield.type(description);
  const $submitbutton = cy.get("[type='submit']");
  $submitbutton.click();
  cy.get("div[data-cy='pages-card']").contains(name).should("exist");
});

Cypress.Commands.add("deletePage", (name: string) => {
  cy.visit("/pages");
  const $text = cy.contains(name).should("exist");

  $text
    .closest("[data-cy='pages-card']")
    .should("exist")
    .find("[data-cy='pages-delete-button']")
    .click();

  cy.contains("Yes").click();
  cy.contains(name).should("not.exist");
});

Cypress.Commands.add("getBlock", (name: string) => {
  return cy.get(`[data-cy-block='${name}']`);
});

Cypress.Commands.add(
  "getInput",
  { prevSubject: true },
  (subject, inputName: string) => {
    return cy.wrap(subject).children(`[data-cy-input='${inputName}']`);
  }
);

Cypress.Commands.add(
  "blockAction",
  { prevSubject: true },
  (subject, actionName: "toggle") => {
    return cy
      .wrap(subject)
      .children("[data-cy='editor-header-input']")
      .find(`[data-cy='editor-${actionName}-input']`)
      .click();
  }
);

Cypress.Commands.add("addBlock", { prevSubject: true }, (subject) => {
  return cy
    .wrap(subject)
    .children(`[data-cy='editor-add-input']`)
    .find("button")
    .click();
});

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
