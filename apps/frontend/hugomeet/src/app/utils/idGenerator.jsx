function generateRoomID(length) {
	let result = "";
	let characters = "abcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < length; i++) {
		if (i !== 0 && i % 3 === 0 && i + 1 < length) {
			result += "-";
		}
		result += characters.charAt(
			Math.floor(Math.random() * characters.length)
		);
	}
	return result;
}

function isRoomIDValid(rooId) {
	const format = new RegExp("^[a-z0-9]{3}-[a-z0-9]{3}-[a-z0-9]{3}$");

	return format.test(rooId);
}

export default {
	generateRoomID,
	isRoomIDValid,
};
