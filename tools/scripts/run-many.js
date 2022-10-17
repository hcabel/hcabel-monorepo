const execSync = require('child_process').execSync;

console.log(1, process.argv);

const target = process.argv[2];
const jobIndex = Number(process.argv[3]);
const jobCount = Number(process.argv[4]);

console.log(3, `npx nx print-affected --base="${process.argv[5]}" --target="${target}"`);
const affected = execSync(
	`npx nx print-affected --base="${process.argv[5]}" --target="${target}"`
).toString('utf-8');
const array = JSON.parse(affected)
	.tasks.map((t) => t.target.project)
	.slice()
	.sort();
const sliceSize = Math.max(Math.floor(array.length / jobCount), 1);
const projects =
	jobIndex < jobCount
		? array.slice(sliceSize * (jobIndex - 1), sliceSize * jobIndex)
		: array.slice(sliceSize * (jobIndex - 1));

console.log(2, projects);

if (projects.length > 0) {
	execSync(
		`npx nx run-many --target="${target}" --projects="${projects}" --parallel`,
		{
			stdio: [0, 1, 2],
		}
	);
}