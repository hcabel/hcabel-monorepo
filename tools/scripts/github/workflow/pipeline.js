const execSync = require('child_process').execSync;

const target = process.argv[2];
const baseSha = process.argv[3];
const headSha = process.argv[4];

execSync(
	`npx nx affected --target=${target} --base=${baseSha} --head=${headSha} --parallel`,
).toString('utf-8');
