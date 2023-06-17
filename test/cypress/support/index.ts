import "cypress-real-events";

// cypress/support/index.ts
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      login(): Chainable<JQuery<HTMLElement>>;
      auth(username: string, password: string): Chainable<JQuery<HTMLElement>>;
      createPage(name: string): Chainable<JQuery<HTMLElement>>;
      gotoPage(name: string): Chainable<JQuery<HTMLElement>>;
      deletePage(name: string): Chainable<JQuery<HTMLElement>>;
      getBlock(name: string): Chainable<JQuery<HTMLDivElement>>;
      getInput(name: string): Chainable<JQuery<HTMLDivElement>>;
      blockAction(inputName: "toggle" | "edit"): Chainable<JQuery<HTMLElement>>;
      addBlock(): Chainable<JQuery<HTMLElement>>;
    }
  }
}
