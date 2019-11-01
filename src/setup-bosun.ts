
import * as installer from './installer';
import * as core from '@actions/core';

async function run() {
  try {

    var bosunFile = await installer.downloadBosun();

    

    console.log(`Downloaded Bosun: ${bosunFile}`);
  
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();