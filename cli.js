#!/usr/bin/env node

const yargs = require("yargs");
const { generateTableOfContent } = require("./lib");

yargs
  .scriptName("repo-toc")
  .usage("$0 [options]")
  .option("dir", {
    alias: "d",
    describe: "Directory path to generate TOC for",
    type: "string",
    demandOption: false,
    default: process.cwd(),
  })
  .option("ext", {
    alias: "e",
    describe: "File extensions to include (comma-separated)",
    type: "string",
    demandOption: false,
    default: ".md",
  })
  .option("output", {
    alias: "o",
    describe: "File path to save the TOC",
    type: "string",
    demandOption: false,
    default: "./README.md",
  })
  .help()
  .alias("help", "h").argv;

const options = yargs.argv;
const dirPath = options.dir;
const extensions = options.ext.split(",");
const filePath = options.output;

generateTableOfContent({ dirPath, extensions, filePath });
