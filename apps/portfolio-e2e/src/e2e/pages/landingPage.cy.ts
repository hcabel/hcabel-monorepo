import { waitUntil } from "../../support/app.po";

describe("Landing Page", () => {

	it("Should show my name and job in first ", () => {
		cy.visit("/");
		cy.get("[data-cy='my-real-name']")
			.should("be.visible")
			.should("have.text", "Hugo Cabel");
		cy.get("[data-cy='my-job']")
			.should("be.visible")
			.should("have.text", "Software Engineer");
	});

	describe("Landing Page - Project section", () => {
		const projectNames = [
			"unreal-vscode-helper",
			"hugomeet",
			"procedural-terrain"
		];

		for (let projectIndex = 0; projectIndex < projectNames.length; projectIndex++) {
			const projectName = projectNames[projectIndex];

			it(`The scroll should be at '${projectName}' pos`, () => {
				cy.visit(`/landing/projects/${projectName}`);

				cy.get(`#InvisibleDivs > div:nth-child(-n+${projectIndex + 1})`)
					.then((previousDivs) => {
						// calculate the target position of the scroll
						let targetPosition = 0;
						previousDivs.each((_, div) => {
							targetPosition += div.clientHeight;
						});
						// Sum the there heights, +10 to make sure that the scroll is not too close to the previous div
						targetPosition += targetPosition === 0 ? 0 : 10;

						// Wait for the scroll to be at the right position, but if 5s are passed, the test will fail
						waitUntil(() => {
							return cy.window().then((win) => {
								return win.scrollY === targetPosition;
							});
						}, { timeout: 5000, interval: 100, errorMessage: `Scroll is not at the right position (${targetPosition})` });

						// check that the window scroll is at the right position
						cy.window()
							.then((win) => {
								expect(win.scrollY).to.equal(targetPosition);
							});
					});
			});

			it(`Should show '${projectName}' project name and description `, () => {
				cy.visit(`/landing/projects/${projectName}`);

				cy.get("[data-cy='Project-Title']")
					.should("be.visible")
					.then((title) => {
						const text = title.text();

						// The text should be the project name, but the format could be different (spacing, capitalization, etc...)

						const projectNameRegex = projectName.replace(/[^a-zA-Z0-9]/g, ".*");
						expect(text).to.match(new RegExp(projectNameRegex, "i"));

					});
				cy.get("[data-cy='Project-Description']")
					.should("be.visible")
					.then((description) => {
						expect(description.text()).to.not.be.empty;
					});
			});
		}
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