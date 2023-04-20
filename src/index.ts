import { pascalCase, paramCase as kebabCase } from "change-case";
import { program } from "commander";
import { existsSync, mkdirSync, statSync, writeFileSync } from "fs";
import { join, relative } from "path";
import recursive from "recursive-readdir";

export const main = async (argv: any) => {
  const { input, output } = parseArgv(argv);
  const cwd = process.cwd();
  const pages = await getPages(input);
  if (!existsSync(join(cwd, output))) mkdirSync(join(cwd, output), { recursive: true });

  const routesImport = ['import React from "react";'];
  const routesBody = [];

  pages.forEach((page) => {
    const from = relative(output, page).replace(/.tsx$/, "");
    const path =
      "/" +
      relative(input, page)
        .replaceAll(/\[(\w+)\]/g, ":$1")
        .replace(/index.tsx$/, "")
        .replace(/\/$/, "")
        .replace(/.tsx$/, "")
        .split("/")
        .map((v) => (v.startsWith(":") ? v : kebabCase(v)))
        .join("/");
    const element = pascalCase(relative(input, page).replace(/.tsx$/, ""));

    routesImport.push(`import ${element} from "${from}";`);
    routesBody.push(`  { path: "${path}", element: <${element} /> },`);
  });

  routesBody.unshift("const routes = [");
  routesBody.push("];");
  routesBody.push("export default routes;\n");

  writeFileSync(join(cwd, output, "routes.tsx"), [...routesImport, ...routesBody].join("\n"));
};

const parseArgv = (argv: any) => {
  program
    .requiredOption("-i --input <path>", "input directory path", (input) => {
      if (!existsSync(input)) throw new Error("input directory does not exits");
      if (!statSync(input).isDirectory()) throw new Error("input directory is not a directory");

      return input;
    })
    .requiredOption("-o, --output <path>", "output directory path");

  program.parse(argv);

  const options = program.opts<{
    input: string;
    output: string;
  }>();

  return {
    input: options.input,
    output: options.output,
  };
};

const getPages = (input: string): Promise<string[]> =>
  new Promise((res, rej) => {
    recursive(input, (err, pages) => {
      if (err) rej(err);
      else res(pages);
    });
  });
