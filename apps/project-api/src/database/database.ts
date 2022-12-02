import mongoose from "mongoose";

function connect()
{
	return (
		mongoose.connect(process.env.MONGO_URI || "", {
			w: "majority",
			appName: "ProjectApi",
		})
	);
}

const database = {
	connect,
};

export default database;