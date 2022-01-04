import { Embed as _Embed } from "eris";

export class Embed implements _Embed {
	public title?: string;
	public description?: string;
	public fields?: {
		name: string;
		value: string;
		inline?: boolean;
	}[];
	public timestamp?: Date;
	public color?: number;
	public footer?: {
		text: string;
		iconURL?: string;
	};
	public author?: {
		name: string;
		url?: string;
		iconURL?: string;
	};

	public type: "rich" | "image" | "video" | "gifv" | "article" | "embed" | "link" = "rich";

	public url: string;

	constructor() {
		this.title = "";
		this.description = "";
		this.fields = [];
		this.timestamp = new Date();
		this.color = 0;
		this.footer = {
			text: "",
			iconURL: ""
		};
		this.author = {
			name: "",
			iconURL: "",
			url: ""
		};
		this.type = "rich";
		this.url = "";
	}

	public setTitle(title: string): this {
		this.title = title;
		return this;
	}

	public setDescription(description: string): this {
		this.description = description;
		return this;
	}

	public setFields(
		fields: {
			name: string;
			value: string;
			inline?: boolean;
		}[]
	): this {
		this.fields = fields;
		return this;
	}

	public addField(name: string, value: string, inline?: boolean): this {
		this.fields!.push({
			name,
			value,
			inline
		});
		return this;
	}

	public addFields(
		fields: {
			name: string;
			value: string;
			inline?: boolean;
		}[]
	): this {
		this.fields = this.fields!.concat(fields);
		return this;
	}

	public setTimestamp(timestamp?: Date): this {
		this.timestamp = timestamp || new Date();
		return this;
	}

	public setColor(hex: string | number): this {
		this.color = typeof hex === "string" ? parseInt(`0x${hex.charAt(0) === "#" ? hex.slice(1) : hex}`) : hex;
		return this;
	}

	public setFooter(text: string, iconURL?: string): this {
		this.footer = {
			text,
			iconURL
		};
		return this;
	}

	public setAuthor(name: string, iconURL?: string, url?: string): this {
		this.author = {
			name,
			iconURL,
			url
		};
		return this;
	}

	public setImage(url: string): this {
		this.type = "image";
		this.url = url;
		return this;
	}

	public setVideo(url: string): this {
		this.type = "video";
		this.url = url;
		return this;
	}

	public setGifv(url: string): this {
		this.type = "gifv";
		this.url = url;
		return this;
	}

	public setArticle(url: string): this {
		this.type = "article";
		this.url = url;
		return this;
	}
}
