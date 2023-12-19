const fse = require("fs-extra");

const outputDirRoot = `${__dirname}/dist`;
const srcDirRoot = `${__dirname}/src`;

console.log("=".repeat(50));

console.log("Copying static files...");

let folderLocations = ["/db/.localStorage", "/public/"];

// Add updatable.json manually

folderLocations.forEach((folderLocation) => {
    console.log(`Copying ${folderLocation}...`);
    try {
        fse.copySync(
            `${srcDirRoot}${folderLocation}`,
            `${outputDirRoot}${folderLocation}`,
            {
                overwrite: true,
            }
        );

        console.log(`Copied ${folderLocation}!`);
    } catch (err) {
        console.trace(err);
    }
});

console.log("=".repeat(50));
console.log("Done copying static files!");
console.log("=".repeat(50));
