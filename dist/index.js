"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const change_case_1 = require("change-case");
const commander_1 = require("commander");
const fs_1 = require("fs");
const path_1 = require("path");
const recursive_readdir_1 = __importDefault(require("recursive-readdir"));
const main = async (argv) => {
    const { input, output } = parseArgv(argv);
    const cwd = process.cwd();
    const pages = await getPages(input);
    if (!(0, fs_1.existsSync)((0, path_1.join)(cwd, output)))
        (0, fs_1.mkdirSync)((0, path_1.join)(cwd, output), { recursive: true });
    const routesImport = ['import React from "react";'];
    const routesBody = [];
    pages.forEach((page) => {
        const from = (0, path_1.relative)(output, page).replace(/.tsx$/, "");
        const path = "/" +
            (0, path_1.relative)(input, page)
                .replaceAll(/\[(\w+)\]/g, ":$1")
                .replace(/index.tsx$/, "")
                .replace(/\/$/, "")
                .replace(/.tsx$/, "")
                .split("/")
                .map((v) => (v.startsWith(":") ? v : (0, change_case_1.paramCase)(v)))
                .join("/");
        const element = (0, change_case_1.pascalCase)((0, path_1.relative)(input, page).replace(/.tsx$/, ""));
        routesImport.push(`import ${element} from "${from}";`);
        routesBody.push(`  { path: "${path}", element: <${element} /> },`);
    });
    routesBody.unshift("const routes = [");
    routesBody.push("];");
    routesBody.push("export default routes;\n");
    (0, fs_1.writeFileSync)((0, path_1.join)(cwd, output, "routes.tsx"), [...routesImport, ...routesBody].join("\n"));
};
exports.main = main;
const parseArgv = (argv) => {
    commander_1.program
        .requiredOption("-i --input <path>", "input directory path", (input) => {
        if (!(0, fs_1.existsSync)(input))
            throw new Error("input directory does not exits");
        if (!(0, fs_1.statSync)(input).isDirectory())
            throw new Error("input directory is not a directory");
        return input;
    })
        .requiredOption("-o, --output <path>", "output directory path");
    commander_1.program.parse(argv);
    const options = commander_1.program.opts();
    return {
        input: options.input,
        output: options.output,
    };
};
const getPages = (input) => new Promise((res, rej) => {
    (0, recursive_readdir_1.default)(input, (err, pages) => {
        if (err)
            rej(err);
        else
            res(pages);
    });
});
