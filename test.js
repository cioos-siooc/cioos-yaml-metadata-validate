/*

Test validation on a known valid file

*/

const schema = require("./web/schema");
const fs = require("fs");
const YAML = require("yaml");

const recordStr = fs.readFileSync("web/sample.yaml", "utf8");
const record = YAML.parse(recordStr);

const res = schema.validate(record);

if (res.error) {
  console.error(JSON.stringify(res.error.details, 0, 2));
  process.exit(1);
}
