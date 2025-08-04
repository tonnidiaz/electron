import { mkdirSync, writeFileSync } from "fs";
import { dirname } from "path";

async function genIcons(collection = "solar", list: string[] = []) {
    const pth = `@iconify-json/${collection}/icons.json`
    console.log('\n', {pth})
    let iconsJson = {...await import(pth)};
    const icons = {};
    console.log(iconsJson.icons != undefined)
    for (let k of list) {
        icons[k] = iconsJson.icons[k];
    }

    iconsJson.icons = icons
    delete iconsJson['default']
    delete iconsJson['aliases']
    
    const saveTo = `./src/assets/iconify/${collection}/icons.json`;
    mkdirSync(dirname(saveTo), { recursive: true })
    writeFileSync(saveTo, JSON.stringify(iconsJson))
    console.log(Object.keys(iconsJson.icons));
    console.log({saveTo}, '\n')
}

genIcons("solar", [
    "folder-open-bold",
    "folder-bold",
    "file-linear",
    "add-folder-bold",
    'folder-with-files-linear',
    'users-group-rounded-linear',
    'settings-linear',
    'info-circle-linear',
    'alt-arrow-up-linear',
    'alt-arrow-down-linear',
    'alt-arrow-left-linear',
    'alt-arrow-right-linear',
    'arrow-right-linear',
    'arrow-left-linear'
]);
