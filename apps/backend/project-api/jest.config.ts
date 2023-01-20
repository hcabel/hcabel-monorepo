/* eslint-disable */
export default {
	displayName: "project-api",
	preset: "../../../jest.preset.js",
	globals: {
		"ts-jest": {
			tsconfig: "<rootDir>/tsconfig.spec.json",
		},
	},
	testEnvironment: "node",
	coverageDirectory: "../../../coverage/apps/backend/project-api",
	setupFiles: ["<rootDir>/testing/setup.ts"],
};
