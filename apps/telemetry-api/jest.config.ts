/* eslint-disable */
export default {
	displayName: "telemetry-api",
	preset: "../../jest.preset.js",
	globals: {
		"ts-jest": {
			tsconfig: "<rootDir>/tsconfig.spec.json",
		},
	},
	testEnvironment: "node",
	transform: {
		"^.+\\.[tj]s$": "ts-jest",
	},
	moduleFileExtensions: ["ts", "js", "html"],
	coverageDirectory: "../../coverage/apps/telemetry-api",
	setupFiles: [
		"<rootDir>/src/testing/setup.ts"
	],
};
