"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
//@ts-expect-error
const readdir_recursive_1 = __importDefault(require("readdir-recursive"));
const path_1 = require("path");
const cache_1 = require("./cache");
const { fileSync } = new readdir_recursive_1.default();
class Database {
    constructor() {
        this.models = new Map();
        for (const model of fileSync(path_1.resolve("dist/Database/models"))) {
            const Model = require(model);
            this.models.set(Model.modelName, new cache_1.Cache(Model.modelName, Model, new Map()));
        }
    }
}
exports.Database = Database;
