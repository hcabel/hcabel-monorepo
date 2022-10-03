
describe("The landing page should show all the projects infos", () => {
	beforeEach(() => {
		cy.visit("/");
		cy.wait(1000); // @TODO: Remove this when loading animation finished
	});

	it("should show all my project's name and desc", () => {

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
});