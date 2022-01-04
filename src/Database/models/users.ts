import { model, Schema } from "mongoose";

const UserSchema = new Schema({
	_id: Schema.Types.ObjectId,

	userID: {
		type: String,
		required: true,
		unique: true
	},

	points: {
		type: Number,
		default: 0
	}
});

export = model("User", UserSchema, "users");
