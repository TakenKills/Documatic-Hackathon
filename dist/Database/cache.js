"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const events_1 = require("events");
const mongoose_1 = require("mongoose");
class Cache extends events_1.EventEmitter {
    constructor(name, model, cache) {
        super();
        this.name = name;
        this.model = model;
        this.cache = cache;
        if (!this.cache)
            throw "Cache is not defined";
        this.on("clearCache", (key) => this.cache.delete(key));
    }
    async findOne(query) {
        const doc = this.cache.get(`${Object.values(query)}_${this.name}`);
        if (!doc) {
            const data = await this.model.findOne(query);
            if (!data)
                return;
            this.cache.set(`${Object.values(query)}_${this.name}`, data);
            this.deleteCache(60, `${Object.values(query)}_${this.name}`);
            return data;
        }
        else
            return doc;
    }
    async find(query = {}) {
        const data = await this.model.find(query);
        if (data.length === 0)
            return [];
        this.cache.set(`${Object.values(query)}_${this.name}`, data);
        this.deleteCache(60, `${Object.values(query)}_${this.name}`);
        return data;
    }
    async deleteOne(query) {
        this.emit("clearCache", `${Object.values(query)}_${this.name}`);
        return this.model.deleteOne(query);
    }
    async insertOne(document) {
        const doc = Object.assign({ _id: new mongoose_1.Types.ObjectId() }, document);
        await new this.model(doc).save();
        return (await this.findOne(doc));
    }
    async updateOne(query, update) {
        await this.model.updateOne(query, update);
        this.deleteCache(0, `${Object.values(query)}_${this.name}`);
        const doc = await this.findOne(query);
        if (!doc)
            return;
        this.cache.set(`${Object.values(query)}_${this.name}`, doc);
        this.deleteCache(60, `${Object.values(query)}_${this.name}`);
        return doc;
    }
    deleteCache(ttl, current) {
        setTimeout(() => {
            this.cache.delete(current);
            return true;
        }, ttl * 1000);
        return true;
    }
}
exports.Cache = Cache;
