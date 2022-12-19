
describe("The Landing page", () => {

	it("Should show my name and job in first ", () => {
		cy.visit("/");
		cy.get("[data-cy='my-real-name']")
			.should("be.visible")
			.should("have.text", "Hugo Cabel");
		cy.get("[data-cy='my-job']")
			.should("be.visible")
			.should("have.text", "Software Engineer");
	});

	it("should show all my project's name and desc", () => {
		cy.visit("/");
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(1000); // @TODO: Remove this when loading animation finished

		// Check if the project Unreal VsCode Helper is properly displayed
		cy.get("[data-cy='Project-Unreal VsCode Helper-Title']")
			.then((title) => {
				expect(title.text()).to.equal("Unreal VsCode Helper");
			});
		cy.get("[data-cy='Project-Unreal VsCode Helper-Description']")
			.then((desc) => {
				expect(desc.text()).to.not.be.empty;
			});

		// Check if the project Hugo is properly displayed
		cy.get("[data-cy='Project-HugoMeet-Title']")
			.then((title) => {
				expect(title.text()).to.equal("HugoMeet");
			});
		cy.get("[data-cy='Project-HugoMeet-Description']")
			.then((desc) => {
				expect(desc.text()).to.not.be.empty;
			});

		// Check if the project Procedural Terrain is properly displayed
		cy.get("[data-cy='Project-Procedural Terrain-Title']")
			.then((title) => {
				expect(title.text()).to.equal("Procedural Terrain");
			});
		cy.get("[data-cy='Project-Procedural Terrain-Description']")
			.then((desc) => {
				expect(desc.text()).to.not.be.empty;
			});
	});

	describe('Should go directly to the project specifed in the url hash', () => {

		it("Should go to the intro when there is no hash or an invalid one in the landing page url", () => {
			const invalidHashes = [
				"#qwerqwer",
				"#",
				"",
			];

			for (const invalidHash of invalidHashes) {
				cy.visit(`/${invalidHash}`);
				cy.get("[data-cy='my-real-name']").should('be.visible');
			}
		});

		it("Should go to the project UVCH when using '#uvch' in the landing page url", () => {
			cy.visit(`/#uvch`);
			cy.get("[data-cy='Project-Unreal VsCode Helper-Title']", {
				timeout: 5000 /* 5second */,
			}).should('be.visible');
		});

		it("Should go to the project HugoMeet when using '#hugomeet' in the landing page url", () => {
			cy.visit(`/#hugomeet`);
			cy.get("[data-cy='Project-HugoMeet-Title']", {
				timeout: 5000 /* 5second */,
			}).should('be.visible');
		});

		it("Should go to the project Procedural Terrain when using '#procedural-terrain' in the landing page url", () => {
			cy.visit("/#procedural-terrain");
			// eslint-disable-next-line cypress/no-unnecessary-waiting
			cy.get("[data-cy='Project-Procedural Terrain-Title']", {
				timeout: 5000 /* 5second */,
			})
				.should('be.visible');
		});

	});

	describe("Translation", () => {
		// TODO: Should be translated in english by default

		it("Should be able to change the language of the website", () => {
			cy.visit("/");

			// Open language selector
			cy.get("[data-cy='language-selector']").click();
			// Click on the french option
			cy.get("[data-cy='language-selector-option-fr']").trigger("click");
			// should be redirect to the french version of the website
			cy.url().should("contain", "/fr");
		});

		// TODO: Should be translated in french when using the french language
	});
});