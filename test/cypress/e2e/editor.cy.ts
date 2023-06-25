describe("Editor", () => {
  // const TEST_PAGE_NAME = "test_page_" + Math.floor(Math.random() * 1000);
  const TEST_PAGE_NAME = "For Testing Purposes";
  const ROOT_BLOCK = "Root";
  const CONTAINER_BLOCK = "container";

  beforeEach(() => {
    cy.exec("yarn cy:seed");
    cy.login();
    cy.gotoPage(TEST_PAGE_NAME);
  });

  it("Add Input", () => {
    cy.getBlock(ROOT_BLOCK).getInput("children").addBlock();
    cy.getBlock(CONTAINER_BLOCK).should("exist");
  });

  it("Can toggle inputs", () => {
    cy.getBlock(ROOT_BLOCK).getInput("children").addBlock();
    cy.getBlock(CONTAINER_BLOCK).should("exist");
    cy.getBlock(CONTAINER_BLOCK)
      .children("[data-cy='editor-children']")
      .should("have.css", "display", "none");
    cy.getBlock(CONTAINER_BLOCK).blockAction("toggle");
    cy.getBlock(CONTAINER_BLOCK)
      .children("[data-cy='editor-children']")
      .should("not.have.css", "display", "none");
  });

  it("Can edit an block type", () => {
    cy.getBlock(ROOT_BLOCK).getInput("children").addBlock();
    cy.getBlock(CONTAINER_BLOCK).should("exist");
    cy.getBlock(CONTAINER_BLOCK).blockAction("toggle");
    cy.getBlock(CONTAINER_BLOCK)
      .getInput("children")
      .children("[data-cy='editor-drop-target']")
      .blockAction("edit");
    cy.contains("Text Block").click();

    cy.getBlock("textBlock").blockAction("toggle");
    cy.getBlock("textBlock").getInput("text").find("input").type("Hello World");
    cy.get("[data-cy='editor-refresh']").click();
    cy.get("#preview-root").contains("Hello World");
  });

  it("Can save updates", () => {
    cy.getBlock(ROOT_BLOCK).getInput("children").addBlock();
    cy.getBlock(CONTAINER_BLOCK).should("exist");
    cy.getBlock(CONTAINER_BLOCK).blockAction("toggle");
    cy.getBlock(CONTAINER_BLOCK)
      .getInput("children")
      .children("[data-cy='editor-drop-target']")
      .blockAction("edit");
    cy.contains("Text Block").click();

    cy.getBlock("textBlock").blockAction("toggle");
    cy.getBlock("textBlock").getInput("text").find("input").type("Hello World");
    cy.get("[data-cy='editor-save']").click();
    cy.reload();
    cy.get("#preview-root").contains("Hello World");
  });

  it("Can display a preview", () => {
    cy.getBlock(ROOT_BLOCK).getInput("children").addBlock();
    cy.getBlock(CONTAINER_BLOCK).should("exist");
    cy.getBlock(CONTAINER_BLOCK).blockAction("toggle");
  });

  it("Can publish a page", () => {
    cy.getBlock(ROOT_BLOCK).getInput("children").addBlock();
    cy.getBlock(CONTAINER_BLOCK).should("exist");
    cy.getBlock(CONTAINER_BLOCK).blockAction("toggle");
    cy.getBlock(CONTAINER_BLOCK)
      .getInput("children")
      .children("[data-cy='editor-drop-target']")
      .blockAction("edit");

    cy.contains("Text Block").click();
    cy.getBlock("textBlock").blockAction("toggle");
    cy.getBlock("textBlock").getInput("text").find("input").type("Hello World");

    cy.get("[data-cy='editor-save']").click();
    cy.get("[data-cy='editor-publish']").click();

    cy.visit("/pages");
    const $text = cy.contains(TEST_PAGE_NAME).should("exist");
    const $card = $text.closest("[data-cy='pages-card']").should("exist");
    $card
      .find("[data-cy='pages-share-button']")
      .invoke("removeAttr", "target")
      .click();

    cy.contains("Hello World");
  });

  it("Can drag inputs", () => {
    cy.getBlock(ROOT_BLOCK).getInput("children").addBlock();
    cy.getBlock(CONTAINER_BLOCK).should("exist");
    cy.getBlock(ROOT_BLOCK).getInput("children").addBlock();
    cy.getBlock(CONTAINER_BLOCK).should("exist").should("have.length", 2);
    cy.getBlock(CONTAINER_BLOCK).eq(0).blockAction("toggle");
    cy.getBlock(CONTAINER_BLOCK).eq(1).drag("[data-cy='editor-drop-target']");
    cy.getBlock(ROOT_BLOCK)
      .getInput("children")
      .children("[data-cy='editor-drop-target']")
      .should("exist");

    cy.getBlock(CONTAINER_BLOCK)
      .eq(0) // search only in the first container
      .getInput("children")
      .children("[data-cy='editor-drop-target']")
      .should("not.exist");
  });
});
