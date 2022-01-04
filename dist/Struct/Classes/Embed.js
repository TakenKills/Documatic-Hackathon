"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Embed = void 0;
class Embed {
    constructor() {
        this.type = "rich";
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
    setTitle(title) {
        this.title = title;
        return this;
    }
    setDescription(description) {
        this.description = description;
        return this;
    }
    setFields(fields) {
        this.fields = fields;
        return this;
    }
    addField(name, value, inline) {
        this.fields.push({
            name,
            value,
            inline
        });
        return this;
    }
    addFields(fields) {
        this.fields = this.fields.concat(fields);
        return this;
    }
    setTimestamp(timestamp) {
        this.timestamp = timestamp || new Date();
        return this;
    }
    setColor(hex) {
        this.color = typeof hex === "string" ? parseInt(`0x${hex.charAt(0) === "#" ? hex.slice(1) : hex}`) : hex;
        return this;
    }
    setFooter(text, iconURL) {
        this.footer = {
            text,
            iconURL
        };
        return this;
    }
    setAuthor(name, iconURL, url) {
        this.author = {
            name,
            iconURL,
            url
        };
        return this;
    }
    setImage(url) {
        this.type = "image";
        this.url = url;
        return this;
    }
    setVideo(url) {
        this.type = "video";
        this.url = url;
        return this;
    }
    setGifv(url) {
        this.type = "gifv";
        this.url = url;
        return this;
    }
    setArticle(url) {
        this.type = "article";
        this.url = url;
        return this;
    }
}
exports.Embed = Embed;
