// Load tempDirectory before it gets wiped by tool-cache
let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';
import * as os from 'os';
import * as path from 'path';

import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';

let osPlat: string = os.platform();
let osArch: string = os.arch();

if (!tempDirectory) {
  let baseLocation;
  if (process.platform === 'win32') {
    // On windows use the USERPROFILE env variable
    baseLocation = process.env['USERPROFILE'] || 'C:\\';
  } else {
    if (process.platform === 'darwin') {
      baseLocation = '/Users';
    } else {
      baseLocation = '/home';
    }
  }
  tempDirectory = path.join(baseLocation, 'actions', 'temp');
}

export async function downloadBosun(): Promise<string> {
    let downloadBase = "https://github.com/naveego/bosun/releases/download";
    let target = `/1.19.0/bosun_1.19.0_${osPlat}_${osArch}.tar.gz`
    let packageUrl = downloadBase + target;
    let downloadPath: string | null = null;

    try {
        downloadPath = await tc.downloadTool(packageUrl);
    }
    catch(error) {
        core.debug(error);

        throw `Failed to download ${target}: ${error}`;
    }

    //
    // Extract
    //
    let extPath: string = tempDirectory;
    if (!extPath) {
        throw new Error('Temp directory not set');
    }

    extPath = await tc.extractTar(downloadPath);

    const toolRoot = path.join(extPath, 'bosun');
    return await tc.cacheDir(toolRoot, 'bosun', '1.19.0');
}
