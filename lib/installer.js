"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Load tempDirectory before it gets wiped by tool-cache
let tempDirectory = process.env["RUNNER_TEMPDIRECTORY"] || "";
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const core = __importStar(require("@actions/core"));
const tc = __importStar(require("@actions/tool-cache"));
const request = __importStar(require("request-promise-native"));
let osPlat = os.platform();
let osArch = os.arch();
if (!tempDirectory) {
    let baseLocation;
    if (process.platform === "win32") {
        // On windows use the USERPROFILE env variable
        baseLocation = process.env["USERPROFILE"] || "C:\\";
    }
    else {
        if (process.platform === "darwin") {
            baseLocation = "/Users";
        }
        else {
            baseLocation = "/home";
        }
    }
    tempDirectory = path.join(baseLocation, "actions", "temp");
}
function downloadBosun() {
    return __awaiter(this, void 0, void 0, function* () {
        let latestUrl = "https://github.com/naveego/bosun/releases/latest";
        let latestResult = yield request
            .get(latestUrl, { followRedirect: false, resolveWithFullResponse: true })
            .then(() => {
            throw new Error("Expected a redirect.");
        })
            .catch(error => {
            return error.response.headers.location;
        });
        console.log(latestResult);
        const parts = latestResult.split("/");
        const tag = parts[parts.length - 1];
        let toolPath = tc.find("bosun", tag);
        if (toolPath) {
            console.log("Using cached version " + tag);
        }
        else {
            console.log("Downloading bosun version ${tag}...");
            let packageUrl = latestUrl + getBosunFileName(tag);
            let downloadPath = null;
            try {
                downloadPath = yield tc.downloadTool(packageUrl);
            }
            catch (error) {
                core.debug(error);
                throw `Failed to download ${packageUrl}: ${error}`;
            }
            //
            // Extract
            //
            let extPath = tempDirectory;
            if (!extPath) {
                throw new Error("Temp directory not set");
            }
            // console.log(downloadPath);
            extPath = yield tc.extractTar(downloadPath);
            toolPath = yield tc.cacheDir(extPath, "bosun", tag);
        }
        core.addPath(toolPath);
        return toolPath;
    });
}
exports.downloadBosun = downloadBosun;
function getBosunFileName(tag) {
    const fileArch = osArch === "x64" ? "amd64" : "386";
    let fileOS = osPlat === "win32" ? "windows" : osPlat;
    return `/download/bosun_${tag}_${fileOS}_${fileArch}.tar.gz`;
}
