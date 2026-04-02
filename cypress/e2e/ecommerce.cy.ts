describe("Ganga E-commerce App", () => {

    beforeEach(() => {
        cy.visit("/");
    });

    it("loads homepage", () => {
        cy.contains("Ganga").should("exist");
    });

    it("displays products", () => {
        cy.get("[data-testid='product-card']").should("have.length.greaterThan", 0);
    });

    it("adds item to cart", () => {
        cy.get("[data-testid='add-to-cart']").first().click();
        cy.contains("Cart").should("contain", "1");
    });

    it("filters products by category", () => {
        cy.get("select").first().select(1);
        cy.wait(1000);
        cy.get("[data-testid='product-card']").should("exist");
    });

    it("navigates to cart page", () => {
        cy.contains("Cart").click();
        cy.url().should("include", "/cart");
    });

    it("removes item from cart", () => {
        it("removes item from cart", () => {
            cy.visit("/");

            // add item first
            cy.get("[data-testid='add-to-cart']").first().click();

            // go to cart
            cy.contains("Cart").click();

            // now remove should exist
            cy.get("[data-testid='remove-item']").should("exist").first().click();
        });
    });

});