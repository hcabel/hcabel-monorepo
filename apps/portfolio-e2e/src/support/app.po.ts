
interface WaitUntilOptions {
	timeout: number;
	interval: number;
	errorMessage: string;
}

export function waitUntil(condition: () => Cypress.Chainable<boolean>, options?: Partial<WaitUntilOptions>): Cypress.Chainable<boolean>
{
	const defaultOptions: WaitUntilOptions = {
		timeout: 5000,
		interval: 100,
		errorMessage: "waitUntil timed out"
	};

	const { timeout, interval, errorMessage } = { ...defaultOptions, ...options };

	const start = Date.now();

	return cy.then(() =>
	{
		return new Cypress.Promise<boolean>((resolve, reject) =>
		{
			const intervalId = setInterval(() =>
			{
				if (condition())
				{
					clearInterval(intervalId);
					resolve(true);
				}
				else if (Date.now() - start >= timeout)
				{
					clearInterval(intervalId);
					reject(new Error(errorMessage));
				}
			}, interval);
		});
	});
};
