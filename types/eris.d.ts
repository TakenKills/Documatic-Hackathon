import { User as original_user } from "eris";

declare module "eris" {
	interface User extends original_user {
		tag: string;
	}
}
