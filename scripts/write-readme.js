"use strict;";
const fs = require("fs");
const appRoot = require("app-root-path");
let path = require("path");

//Get the data
path = path.parse(appRoot.path);
parentFolderPath = path.dir.split(path.sep).pop();
const data = fs.readFileSync(`${parentFolderPath}/people.json`);
const json = JSON.parse(data);

// Table header
const header = `|#|Name|URLs|Work|Topics|
|---|---|---|---|---|
`;

//Order by name
json.people.sort(function (a, b) {
    return a.name.localeCompare(b.name);
});


//Generate with proper formating
const peopleList = json.people
    .map(
        (person, index) => {
            let socials = [];
            ['Website', 'LinkedIn', 'Twitter', 'Mastodon'].forEach(social => {
                if (person.hasOwnProperty(social.toLowerCase()) && person[social.toLowerCase()].length > 0) {
                    socials.push(`[${social}](${person[social.toLowerCase()]})`);
                }
            });

            return `| ${++index}. | **[${person.name}](${person.scheduling})** | ${socials.join('<br/>')} | ${person.title} at ${person.company} | ${person.topics.join(', ')} |`
        }
    )
    .join("\r\n");

//Write README.md
const template = fs.readFileSync(`${appRoot}/README-TEMPLATE.md`, "utf8");
fs.writeFileSync(
    `${parentFolderPath}/README.md`,
    template.replace("PLACEHOLDER", [header, peopleList].join(""))
);
