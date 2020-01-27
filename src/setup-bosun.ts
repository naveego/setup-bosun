import * as installer from "./installer";
import * as core from "@actions/core";
import * as path from "path";
const glob = require("@actions/glob");

async function run() {
  try {
    console.log("Running installer in " + __dirname);

    var bosunPath = await installer.downloadBosun();

    console.log(`Downloaded Bosun: ${bosunPath}`);

    const globber = await glob.create(__dirname + "/**", {
      followSymbolicLinks: false
    });
    const files = await globber.glob();

    console.log("Files: ", files);

    core.exportVariable(
      "BOSUN_CONFIG",
      path.join(__dirname, "/assets/bosun.yaml")
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
