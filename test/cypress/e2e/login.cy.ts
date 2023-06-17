describe("Login", () => {
  it("Fail to login", () => {
    cy.auth("test", "wrong");
    cy.get("div[data-cy='error-login']").should("exist");
  });

  it("Login works", () => {
    cy.login();
  });
});
