
function GetLandingPageUrl(locale: string) {
	return `/${locale}/landing`;
}

const LOCALES = ["en", "fr"];

describe("Middleware", () => {

	it("Should redirect / to the landing page in english", () => {
		cy.visit("/");
		cy.url().should("contain", GetLandingPageUrl("en"));
	});

	for (const locale of LOCALES) {
		it (`Should use the first path section to set the right local (${locale})`, () => {
			cy.visit(`/${locale}`);
			cy.url().should("contain", GetLandingPageUrl(locale));
		});
	}

	it("Should redirect to the page but in english when the locale is not specified", () => {
		const randomPath = Math.random().toString(36).substring(7);
		cy.visit(`/${randomPath}`, { failOnStatusCode: false });
		cy.url().should("contain", `/en/${randomPath}`);
	});

	for (const locale of LOCALES) {
		it (`Should use Accept-Language header (=${locale}) to select the right locale`, () => {
			const randomPath = Math.random().toString(36).substring(7);
			cy.visit(`/${randomPath}`, {
				failOnStatusCode: false,
				headers: { "Accept-Language": locale },
			});
			cy.url().should("contain", `/${locale}/${randomPath}`);
		});
	}

	it("Should not redirect if the first part of the url is a special case (_next, api, etc...)", () => {
		const specialPath = [
			"_next",
			"api",
		];

		for (const path of specialPath) {
			const randomPath = Math.random().toString(36).substring(7);

			cy.visit(`/${path}/${randomPath}`, { failOnStatusCode: false });
			cy.url().should("contain", `/${path}/${randomPath}`);
		}
	});

});