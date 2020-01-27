import * as installer from "./installer";
import * as core from "@actions/core";
import * as path from "path";

async function run() {
  try {
    var bosunPath = await installer.downloadBosun();

    console.log(`Downloaded Bosun: ${bosunPath}`);

    core.exportVariable(
      "BOSUN_CONFIG",
      path.join(__dirname, "/assets/bosun.yaml")
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
