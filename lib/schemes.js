let options = {
  bot_: "temp JSON DEFAULT '{}' ",
  sck1: "rank JSON DEFAULT '{}' ",
  sck: "disables TEXT[] DEFAULT ARRAY[]::TEXT[] ",
  tempdb: "creator TEXT DEFAULT 'Suhail-SER'"
};
let optJson = {
  bot_: {},
  sck1: {
    rank: {}
  },
  sck: {},
  tempdb: {}
};
const {
  sck1
} = require(__dirname + "/database/user");
const {
  sck
} = require(__dirname + "/database/group");
const {
  alive
} = require(__dirname + "/database/alive");
const {
  dbtemp
} = require(__dirname + "/database/tempdb");
const {
  Pool
} = require("pg");
let pg = {};
const fs = require("fs");
const path = require("path");
let pgtables = {
  bot_: " \n        CREATE TABLE IF NOT EXISTS bot_ (\n          id VARCHAR(255) UNIQUE NOT NULL DEFAULT 'Suhail-MD',\n          alive_text TEXT DEFAULT '*HEY &user* \n\n*ι αм σηℓιηє нσω ¢αη ι нєℓρ уσυ* \nι αм ᴍυℓтι ԃєνιᴄє ωнαтѕαρρ вσт \n\n*_Update Alive Message by adding text with Alive_* \n*SUPPORT US https://youtube.com/suhailtechinfo*',\n          alive_get TEXT DEFAULT 'you didnt set alive message yet\n _https://github.com/SuhailTechInfo/Suhail-Md/wiki/alive_',\n          alive_url VARCHAR(255) DEFAULT '',\n          alive_image BOOLEAN DEFAULT false,\n          alive_video BOOLEAN DEFAULT false,\n          permit BOOLEAN DEFAULT false,\n          permit_values VARCHAR(255) DEFAULT '212',\n          chatbot VARCHAR(255) DEFAULT 'false',\n          bgm BOOLEAN DEFAULT false,\n          bgmarray JSON DEFAULT '{}',\n          plugins JSON DEFAULT '{}',\n          notes JSON DEFAULT '{}',\n          antiviewonce VARCHAR(255) DEFAULT 'true',\n          antidelete VARCHAR(255) DEFAULT 'true',\n          autobio VARCHAR(255) DEFAULT 'false',\n          levelup VARCHAR(255) DEFAULT 'true',\n          autoreaction VARCHAR(255) DEFAULT 'true',\n          anticall VARCHAR(255) DEFAULT 'true',\n          mention JSON DEFAULT '{}',\n          filter JSON DEFAULT '{}',\n          afk JSON DEFAULT '{}',\n          warn JSON DEFAULT '{}',\n          rent JSON DEFAULT '{}'" + (options.bot_ ? ",\n " + options.bot_ : "") + "          \n        );",
  sck1: "\n  CREATE TABLE IF NOT EXISTS sck1 (\n    id VARCHAR(255) UNIQUE NOT NULL DEFAULT 'Suhail-MD',\n    name VARCHAR(255) DEFAULT 'Unknown',\n    times INTEGER DEFAULT 0,\n    permit VARCHAR(255) DEFAULT 'false',\n    ban VARCHAR(255) DEFAULT 'false',\n    afk VARCHAR(255) DEFAULT 'false',\n    afktime INTEGER DEFAULT 0,\n    bot BOOLEAN DEFAULT false,\n    msg JSON DEFAULT '{}',\n    warn JSON DEFAULT '{}'" + (options.sck1 ? ",\n " + options.sck1 : "") + " \n  );",
  sck: "CREATE TABLE IF NOT EXISTS Sck (\n    id VARCHAR(255) UNIQUE NOT NULL DEFAULT 'Suhail_Md',\n    events VARCHAR(255) DEFAULT 'false',\n    nsfw VARCHAR(255) DEFAULT 'false',\n    pdm VARCHAR(255) DEFAULT 'false',\n    antipromote VARCHAR(255) DEFAULT 'false',\n    antidemote VARCHAR(255) DEFAULT 'false',\n    welcome VARCHAR(255) DEFAULT 'false',\n    goodbye VARCHAR(255) DEFAULT 'false',\n    welcometext TEXT DEFAULT '*@user @pp Welcome Bruhhh In @gname.....!!!!!😊👇🏻♥️* \n&context*MUST READ GROUP DESCRIPTION*\n@desc\n\n *______________*\n   *Support us by Subscribing*\n@yt_channel',\n    goodbyetext TEXT DEFAULT '@user @pp Left From @gname.....!!!!!😒👆🏻♥️\n*MUST READ GROUP DESCRIPTION*\n@desc\n \n&context______________\nSupport us by Subscribing\n@yt_channel',\n    botenable VARCHAR(255) DEFAULT 'true',\n    antilink VARCHAR(255) DEFAULT 'false',\n    antiword JSON DEFAULT '{}',\n    antifake VARCHAR(255) DEFAULT 'false',\n    antispam VARCHAR(255) DEFAULT 'false',\n    antitag VARCHAR(255) DEFAULT 'false',\n    antibot VARCHAR(255) DEFAULT 'false',\n    onlyadmin VARCHAR(255) DEFAULT 'false',\n    economy VARCHAR(255) DEFAULT 'false',\n    disablecmds VARCHAR(255) DEFAULT 'false',\n    chatbot VARCHAR(255) DEFAULT 'false',\n    mute VARCHAR(255) DEFAULT 'false',\n    unmute VARCHAR(255) DEFAULT 'false'" + (options.sck ? ",\n " + options.sck : "") + " \n  );",
  tempdb: "\n  CREATE TABLE IF NOT EXISTS tempdb (\n    id VARCHAR(255) UNIQUE NOT NULL DEFAULT 'Suhail-MD',\n    data JSON DEFAULT '{}'" + (options.tempdb ? ",\n " + options.tempdb : "") + " \n  );"
};
global.DATABASE_URL = global.DATABASE_URL || global.DATABASE_URI || process.env.DATABASE_URL;
let cacheTable = {};
global.pool = global.pool || false;
if (typeof global.sqldb === "undefined") {
  global.sqldb = false;
}
pg.connnectpg = () => {
  if (pool) {
    return sqldb;
  }
  pool = new Pool({
    connectionString: global.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  pool.on("connect", () => {
    cacheTable.connnectpg = true;
    global.sqldb = true;
  });
  let retrying = false;
  pool.on("error", err => {
    console.log("PostgreSQL database error:", err && err.message);
    if (retrying) {
      return;
    }
    retrying = true;
    setTimeout(() => {
      retrying = false;
      try {
        pool.query("SELECT 1").catch(() => {});
      } catch (e) {}
    }, 5000);
  });
  return sqldb;
};
pg.createTable = async tableName => {
  if (!sqldb && !cacheTable.connnectpg || !pool && global.sqldb) {
    let created = pg.connnectpg();
    if (!created) {
      return false;
    }
  }
  if (cacheTable[tableName]) {
    return true;
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(pgtables[tableName]);
    await client.query("COMMIT");
    if (!cacheTable[tableName]) {
      console.log("PostgreSQL " + tableName + " Table created in Database.");
    }
    cacheTable[tableName] = true;
    return true;
  } catch (err) {
    console.log("Error creating PostgreSQL " + tableName + " Table:", err);
  } finally {
    client.release();
  }
};
pg.new = async (tableName, id) => {
  if (!(await pg.createTable(tableName))) {
    return false;
  }
  const client = await pool.connect();
  try {
    if (await pg.findOne(tableName, id)) {
      return await pg.updateOne(tableName, {
        id: id?.id
      }, id);
    }
    await client.query("BEGIN");
    const sql = "\n      INSERT INTO " + tableName + " (" + Object.keys(id).join(", ") + ")\n      VALUES (" + Object.keys(id).map((item, index) => "$" + (index + 1)).join(", ").trim() + ")\n      ON CONFLICT (id) DO NOTHING\n      RETURNING *;\n    ";
    const values = Object.values(id);
    const result = await client.query(sql, values);
    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    console.log("Error inserting new row into " + tableName + "\n", err);
  } finally {
    client.release();
  }
};
pg.countDocuments = async tableName => {
  if (!(await pg.createTable(tableName))) {
    return 0;
  }
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT COUNT(*) FROM " + tableName);
    return parseInt(result.rows[0].count);
  } catch (err) {
    return 0;
  } finally {
    client.release();
  }
};
pg.findOne = async (tableName, id) => {
  if (!(await pg.createTable(tableName))) {
    return false;
  }
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM " + tableName + " WHERE id = $1", [id?.id]);
    return result.rows[0];
  } catch (err) {
    console.log("Error while finding " + tableName + " document by Id: " + id?.id + "\n", err);
    return false;
  } finally {
    client.release();
  }
};
pg.find = async (tableName, criteria = {}) => {
  if (!(await pg.createTable(tableName))) {
    return [];
  }
  const client = await pool.connect();
  try {
    let rows = Object.values(criteria);
    if (!rows || !rows[0]) {
      return (await client.query("SELECT * FROM " + tableName))?.rows || [];
    } else if (criteria?.id) {
      const found = await pg.findOne(tableName, criteria);
      return found ? [{
        ...found
      }] : [];
    }
    
    const clauses = [];
    const values = [];
    for (const [k, v] of Object.entries(criteria)) {
      if (v === undefined || v === null) {
        continue;
      }
      values.push(v);
      clauses.push(k + " = $" + values.length);
    }
    if (!clauses.length) {
      return [];
    }
    return (await client.query("SELECT * FROM " + tableName + " WHERE " + clauses.join(" AND "), values))?.rows || [];
  } catch (err) {
    console.log("Error while find " + tableName + " documents", err);
    return [];
  } finally {
    client.release();
  }
};
pg.updateOne = async (tableName, id, setFields = {}) => {
  if (!(await pg.createTable(tableName))) {
    return false;
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const sql = "SELECT * FROM " + tableName + " WHERE id = $1 FOR UPDATE";
    const result = await client.query(sql, [id?.id]);
    if (result.rows[0]) {
      const updateSql = "UPDATE " + tableName + " SET " + Object.keys(setFields).map((item, index) => item + " = $" + (index + 2)).join(", ") + " WHERE id = $1 RETURNING *;";
      const values = [id.id, ...Object.values(setFields)];
      const updateResult = await client.query(updateSql, values);
      await client.query("COMMIT");
      return updateResult.rows[0];
    } else {
      return await pg.new(tableName, {
        ...id,
        ...setFields
      });
    }
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error while finding and updating " + tableName + " document by Id: " + id?.id + "\n", err);
    return [];
  } finally {
    client.release();
  }
};
pg.findOneAndDelete = async (tableName, id) => {
  if (!(await pg.createTable(tableName))) {
    return false;
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query("SELECT * FROM " + tableName + " WHERE id = $1 FOR UPDATE", [id?.id]);
    if (result.rows[0]) {
      const deleteResult = await client.query("DELETE FROM " + tableName + " WHERE id = $1 RETURNING *", [id.id]);
      await client.query("COMMIT");
      return deleteResult.rows[0];
    } else {
      return true;
    }
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error while finding and deleting " + tableName + " document by Id: " + id?.id + "\n", err);
    return false;
  } finally {
    client.release();
  }
};
pg.collection = {
  drop: async tableName => {
    if (!(await pg.createTable(tableName))) {
      return false;
    }
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("DROP TABLE IF EXISTS " + tableName);
      await client.query("COMMIT");
      delete cacheTable[tableName];
      return true;
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Error while dropping " + tableName + " table\n", err);
      return false;
    } finally {
      client.release();
    }
  }
};
let dbs = {
  newtables: {
    bot_: {
      id: "Suhail_Md",
      alive_text: "*HEY &user* \n*ι αм σηℓιηє нσω ¢αη ι нєℓρ уσυ* \n\n_ι αм ᴍυℓтι ԃєνιᴄє ωнαтѕαρρ вσт_ \n\n*_Update Alive Message by adding text with Alive_* \n*SUPPORT US https://youtube.com/suhailtechinfo*",
      alive_get: "you did'nt set alive message yet\nType [.alive info] to get alive info",
      alive_url: "",
      alive_image: false,
      alive_video: false,
      permit: false,
      permit_values: "all",
      chatbot: "false",
      antiviewonce: "true",
      antidelete: "true",
      autobio: "false",
      levelup: "false",
      anticall: "true",
      autoreaction: "true",
      bgm: false,
      bgmarray: {},
      plugins: {},
      notes: {},
      warn: {},
      afk: {},
      filter: {},
      mention: {},
      rent: {},
      ...(optJson.bot_ || {})
    },
    sck: {
      id: "Suhail_Md",
      events: "false",
      nsfw: "false",
      pdm: "false",
      antipromote: "false",
      antidemote: "false",
      welcome: "false",
      goodbye: "false",
      welcometext: "*@user @pp Welcome Bruhhh In @gname.....!!!!!😊👇🏻♥️* \n@desc\n\n *______________*\n  *Support us by Subscribing*\n@yt_channel",
      goodbyetext: "*@user @pp Left From @gname.....!!!!!😒👆🏻♥️* \n@desc\n *______________*\n  *Support us by Subscribing*\n@yt_channel",
      botenable: "true",
      antilink: "false",
      antiword: {},
      antifake: "false",
      antispam: "false",
      antitag: "false",
      antibot: "false",
      onlyadmin: "false",
      economy: "false",
      disablecmds: "false",
      chatbot: "false",
      mute: "false",
      unmute: "false",
      ...(optJson.sck || {})
    },
    sck1: {
      id: "chatid",
      name: "Unknown",
      times: 0,
      permit: "false",
      ban: "false",
      warn: {},
      ...(optJson.sck1 || {})
    },
    tempdb: {
      id: "chatid",
      data: {},
      ...(optJson.tempdb || {})
    }
  }
};
// Collections live outside lib/ so the source tree stays clean: data/json/{sck,sck1,bot_}.json
const dataJsonDir = path.join(__dirname, "..", "data", "json");
if (!fs.existsSync(dataJsonDir)) {
  fs.mkdirSync(dataJsonDir, {
    recursive: true
  });
}
const jsonFile = id => path.join(dataJsonDir, id + ".json");

dbs.loadGroupData = async id => {
  try {
    if (fs.existsSync(jsonFile(id))) {
      return await JSON.parse(fs.readFileSync(jsonFile(id), "utf8"));
    } else {
      fs.writeFileSync(jsonFile(id), JSON.stringify({}, null, 2), "utf8");
      return {};
    }
  } catch (err) {
    console.error("Error loading user data:", err);
    return {};
  }
};
dbs.saveGroupData = async (id, data = {}) => {
  fs.writeFileSync(jsonFile(id), JSON.stringify(data, null, 2), "utf8");
};
dbs.countDocuments = async id => {
  try {
    let groupData = await dbs.loadGroupData(id);
    let keys = Object.keys(groupData);
    return keys.length;
  } catch (err) {
    console.log("Error while countDocuments of " + id + " in database,\n", err);
    return 0;
  }
};
dbs.new = async (id, groupId) => {
  try {
    let groupData = await dbs.loadGroupData(id);
    if (!groupData[groupId.id]) {
      groupData[groupId.id] = {
        ...dbs.newtables[id],
        ...groupId
      };
      await dbs.saveGroupData(id, groupData);
      return groupData[groupId.id];
    } else {
      return groupData[groupId.id];
    }
  } catch (err) {
    console.log("Error while Creating new " + id + " in database,\n", err);
    return {};
  }
};
dbs.findOne = async (id, groupId) => {
  try {
    let groupData = await dbs.loadGroupData(id);
    if (groupData[groupId.id]) {
      return groupData[groupId.id];
    } else {
      return;
    }
  } catch (err) {
    console.log("Error while findOne " + id + " in database,\n", err);
    return;
  }
};
dbs.find = async (id, groupId = {}) => {
  try {
    let rows = Object.values(groupId);
    let groupData = await dbs.loadGroupData(id);
    if (groupData[groupId.id]) {
      return [{
        ...groupData[groupId.id]
      }];
    } else if (!rows[0]) {
      return Object.values(groupData);
    }
    return [];
  } catch (err) {
    console.log("Error while finding  " + id + "(s) in database,\n", err);
    return [];
  }
};
dbs.updateOne = async (id, groupId, updateOptions = {}) => {
  try {
    let groupData = await dbs.loadGroupData(id);
    if (groupData[groupId.id]) {
      groupData[groupId.id] = {
        ...groupData[groupId.id],
        ...updateOptions
      };
      await dbs.saveGroupData(id, groupData);
      return groupData[groupId.id];
    } else {
      return await dbs.new(id, {
        ...groupId,
        ...updateOptions
      });
    }
  } catch (err) {
    console.log("Error while updateOne " + id + " in database,\n", err);
    return {};
  }
};
dbs.findOneAndDelete = async (id, groupId) => {
  try {
    let groupData = await dbs.loadGroupData(id);
    delete groupData[groupId.id];
    await dbs.saveGroupData(id, groupData);
    return true;
  } catch (err) {
    console.log("Error while findOneAndDelete " + id + " in database,\n", err);
    return null;
  }
};
dbs.delete = dbs.findOneAndDelete;
dbs.collection = {
  drop: async id => {
    try {
      let groupData = await dbs.loadGroupData(id);
      Object.keys(groupData).forEach(item => delete groupData[item]);
      await dbs.saveGroupData(id, groupData);
      return true;
    } catch (err) {
      console.log("Error while collection.drop all user in database,\n", err);
      return null;
    }
  }
};
dbs.deleteAll = dbs.collection.drop;
let groupdb = {};
groupdb.countDocuments = async () => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (isMongodb) {
      return await sck.countDocuments();
    } else if (sqldb && pg) {
      return await pg.countDocuments("sck");
    } else {
      return await dbs.countDocuments("sck");
    }
  } catch (err) {
    console.log("Error while Creating user in database,\n", err);
    return 0;
  }
};
groupdb.new = async id => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (isMongodb) {
      let groupRecord = (await sck.findOne({
        id: id.id
      })) || (await new sck({
        id: id.id,
        ...id
      }).save());
      return groupRecord;
    } else if (sqldb && pg) {
      var record = (await pg.findOne("sck", {
        id: id.id
      })) || (await pg.new("sck", id));
      return record;
    } else {
      var record = (await dbs.findOne("sck", {
        id: id.id
      })) || (await dbs.new("sck", id));
      return record;
    }
  } catch (err) {
    console.log("Error while Creating user in database,\n", err);
    return {};
  }
};
groupdb.findOne = async id => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (isMongodb) {
      return await sck.findOne({
        id: id.id
      });
    } else if (sqldb && pg) {
      return await pg.findOne("sck", id);
    } else {
      var record = await dbs.findOne("sck", {
        id: id.id
      });
      return record;
    }
  } catch (err) {
    console.log("Error while finding user in database,\n", err);
    return;
  }
};
groupdb.find = async id => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (isMongodb) {
      let record = await sck.find(id);
      return record;
    } else if (sqldb && pg) {
      return await pg.find("sck", id);
    } else {
      return await dbs.find("sck", id);
    }
  } catch (err) {
    console.log("Error while finding user in database,\n", err);
    return [];
  }
};
groupdb.updateOne = async (id, updateOptions = {}) => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (!id.id) {
      return {};
    }
    if (isMongodb) {
      return await sck.updateOne({
        id: id.id
      }, {
        ...updateOptions
      });
    } else if (sqldb && pg) {
      return await pg.updateOne("sck", {
        id: id.id
      }, updateOptions);
    } else {
      return await dbs.updateOne("sck", id, updateOptions);
    }
  } catch (err) {
    console.log("Error while updateOne user in database,\n", err);
    return {};
  }
};
groupdb.findOneAndDelete = async id => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (!id.id) {
      return [];
    }
    if (isMongodb) {
      return await sck.findOneAndDelete({
        id: id.id
      });
    } else if (sqldb && pg) {
      return await pg.findOneAndDelete("sck", id);
    } else {
      return await dbs.findOneAndDelete("sck", id);
    }
  } catch (err) {
    console.log("Error while findOneAndDelete user in database,\n", err);
    return null;
  }
};
groupdb.delete = groupdb.findOneAndDelete;
groupdb.collection = {
  drop: async () => {
    try {
      if (!global.SmdOfficial) {
        return;
      }
      if (isMongodb) {
        return await sck.collection.drop();
      } else if (sqldb && pg) {
        return await pg.collection.drop("sck");
      } else {
        return await dbs.collection.drop("sck");
      }
    } catch (err) {
      console.log("Error while collection.drop all user in database,\n", err);
      return null;
    }
  }
};
let userdb = {};
userdb.countDocuments = async () => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (isMongodb) {
      return await sck1.countDocuments();
    } else if (sqldb && pg) {
      return await pg.countDocuments("sck1");
    } else {
      return await dbs.countDocuments("sck1");
    }
  } catch (err) {
    console.log("Error from userdb.countDocuments() in user database,\n", err);
    return 0;
  }
};
userdb.new = async id => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (isMongodb) {
      let aliveRecord = (await sck1.findOne({
        id: id.id
      })) || (await new sck1({
        id: id.id,
        ...id
      }).save());
      return aliveRecord;
    } else if (sqldb && pg) {
      var record = (await pg.findOne("sck1", {
        id: id.id
      })) || (await pg.new("sck1", id));
      return record;
    } else {
      var record = (await dbs.findOne("sck1", {
        id: id.id
      })) || (await dbs.new("sck1", id));
      return record;
    }
  } catch (err) {
    console.log("Error userdb.new() in user database,\n", err);
    return {};
  }
};
userdb.findOne = async id => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (isMongodb) {
      return await sck1.findOne({
        id: id.id
      });
    } else if (sqldb && pg) {
      return await pg.findOne("sck1", id);
    } else {
      var record = await dbs.findOne("sck1", {
        id: id.id
      });
      return record;
    }
  } catch (err) {
    console.log("Error userdb.findOne() in user database,\n", err);
    return;
  }
};
userdb.find = async id => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (isMongodb) {
      let record = await sck1.find(id);
      return record;
    } else if (sqldb && pg) {
      return await pg.find("sck1", id);
    } else {
      return await dbs.find("sck1", id);
    }
  } catch (err) {
    console.log("Error userdb.find() in user database,\n", err);
    return [];
  }
};
userdb.updateOne = async (id, updateOptions = {}) => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (!id.id) {
      return {};
    }
    if (isMongodb) {
      return await sck1.updateOne({
        id: id.id
      }, {
        ...updateOptions
      });
    } else if (sqldb && pg) {
      return await pg.updateOne("sck1", {
        id: id.id
      }, updateOptions);
    } else {
      return await dbs.updateOne("sck1", id, updateOptions);
    }
  } catch (err) {
    console.log("Error userdb.updateOne() in user database,\n", err);
    return {};
  }
};
userdb.findOneAndDelete = async id => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (!id.id) {
      return [];
    }
    if (isMongodb) {
      return await sck1.findOneAndDelete({
        id: id.id
      });
    } else if (sqldb && pg) {
      return await pg.findOneAndDelete("sck1", id);
    } else {
      return await dbs.findOneAndDelete("sck1", id);
    }
  } catch (err) {
    console.log("Error userdb.findOneAndDelete() in user database,\n", err);
    return null;
  }
};
userdb.delete = userdb.findOneAndDelete;
userdb.collection = {
  drop: async () => {
    try {
      if (!global.SmdOfficial) {
        return;
      }
      if (isMongodb) {
        return await sck1.collection.drop();
      } else if (sqldb && pg) {
        return await pg.collection.drop("sck1");
      } else {
        return await dbs.collection.drop("sck1");
      }
    } catch (err) {
      console.log("Error userdb.collection.drop() in user database,\n", err);
      return null;
    }
  }
};
let alivedb = {};
alivedb.countDocuments = async () => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (isMongodb) {
      return await alive.countDocuments();
    } else if (sqldb && pg) {
      return await pg.countDocuments("bot_");
    } else {
      return await dbs.countDocuments("bot_");
    }
  } catch (err) {
    console.log("Error while Creating user in database,\n", err);
    return 0;
  }
};
alivedb.new = async id => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (isMongodb) {
      let groupRecord = (await alive.findOne({
        id: id.id
      })) || (await new alive({
        id: id.id,
        ...id
      }).save());
      return groupRecord;
    } else if (sqldb && pg) {
      return (await pg.findOne("bot_", {
        id: id.id
      })) || (await pg.new("bot_", id));
    } else {
      var record = (await dbs.findOne("bot_", {
        id: id.id
      })) || (await dbs.new("bot_", id));
      return record;
    }
  } catch (err) {
    console.log("Error while Creating BOT INFO in database,\n", err);
    return {};
  }
};
alivedb.findOne = async id => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (isMongodb) {
      return await alive.findOne({
        id: id.id
      });
    } else if (sqldb && pg) {
      return await pg.findOne("bot_", id);
    } else {
      var record = await dbs.findOne("bot_", {
        id: id.id
      });
      return record;
    }
  } catch (err) {
    console.log("Error while finding user in database,\n", err);
    return;
  }
};
alivedb.find = async id => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (isMongodb) {
      let record = await alive.find(id);
      return record;
    } else if (sqldb && pg) {
      return await pg.find("bot_", id);
    } else {
      return await dbs.find("bot_", id);
    }
  } catch (err) {
    console.log("Error while finding user in database,\n", err);
    return [];
  }
};
alivedb.updateOne = async (id, updateOptions = {}) => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (!id.id) {
      return {};
    }
    if (isMongodb) {
      return await alive.updateOne({
        id: id.id
      }, {
        ...updateOptions
      });
    } else if (sqldb && pg) {
      return await pg.updateOne("bot_", {
        id: id.id
      }, updateOptions);
    } else {
      return await dbs.updateOne("bot_", id, updateOptions);
    }
  } catch (err) {
    console.log("Error while updateOne user in database,\n", err);
    return {};
  }
};
alivedb.findOneAndDelete = async id => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (!id.id) {
      return [];
    }
    if (isMongodb) {
      return await alive.findOneAndDelete({
        id: id.id
      });
    } else if (sqldb && pg) {
      return await pg.findOneAndDelete("bot_", id);
    } else {
      return await dbs.findOneAndDelete("bot_", id);
    }
  } catch (err) {
    console.log("Error while findOneAndDelete user in database,\n", err);
    return null;
  }
};
alivedb.delete = alivedb.findOneAndDelete;
alivedb.collection = {
  drop: async () => {
    try {
      if (!global.SmdOfficial) {
        return;
      }
      if (isMongodb) {
        return await alive.collection.drop();
      } else if (sqldb && pg) {
        return await pg.collection.drop("bot_");
      } else {
        return await dbs.collection.drop("bot_");
      }
    } catch (err) {
      console.log("Error while collection.drop all user in database,\n", err);
      return null;
    }
  }
};
let tempdb = {};
tempdb.countDocuments = async () => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (isMongodb) {
      return await dbtemp.countDocuments();
    } else if (sqldb && pg) {
      return await pg.countDocuments("tempdb");
    } else {
      return await dbs.countDocuments("tempdb");
    }
  } catch (err) {
    console.log("Error while Creating user in database,\n", err);
    return 0;
  }
};
tempdb.new = async id => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (isMongodb) {
      let aliveRecord = (await dbtemp.findOne({
        id: id.id
      })) || (await new dbtemp({
        id: id.id,
        ...id
      }).save());
      return aliveRecord;
    } else if (sqldb && pg) {
      var record = (await pg.findOne("tempdb", {
        id: id.id
      })) || (await pg.new("tempdb", id));
      return record;
    } else {
      var record = (await dbs.findOne("tempdb", {
        id: id.id
      })) || (await dbs.new("tempdb", id));
      return record;
    }
  } catch (err) {
    console.log("Error while Creating user in database,\n", err);
    return {};
  }
};
tempdb.findOne = async id => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (isMongodb) {
      return await dbtemp.findOne({
        id: id.id
      });
    } else if (sqldb && pg) {
      return await pg.findOne("tempdb", id);
    } else {
      var record = await dbs.findOne("tempdb", {
        id: id.id
      });
      return record;
    }
  } catch (err) {
    console.log("Error while finding user in database,\n", err);
    return;
  }
};
tempdb.find = async id => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (isMongodb) {
      let record = await dbtemp.find(id);
      return record;
    } else if (sqldb && pg) {
      return await pg.find("tempdb", id);
    } else {
      return await dbs.find("tempdb", id);
    }
  } catch (err) {
    console.log("Error while finding user in database,\n", err);
    return [];
  }
};
tempdb.updateOne = async (id, updateOptions = {}) => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (!id.id) {
      return {};
    }
    if (isMongodb) {
      return await dbtemp.updateOne({
        id: id.id
      }, {
        ...updateOptions
      });
    } else if (sqldb && pg) {
      return await pg.updateOne("tempdb", {
        id: id.id
      }, updateOptions);
    } else {
      return await dbs.updateOne("tempdb", id, updateOptions);
    }
  } catch (err) {
    console.log("Error while updateOne user in database,\n", err);
    return {};
  }
};
tempdb.findOneAndDelete = async id => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    if (!id.id) {
      return [];
    }
    if (isMongodb) {
      return await dbtemp.findOneAndDelete({
        id: id.id
      });
    } else if (sqldb && pg) {
      return await pg.findOneAndDelete("tempdb", id);
    } else {
      return await dbs.findOneAndDelete("tempdb", id);
    }
  } catch (err) {
    console.log("Error while findOneAndDelete user in database,\n", err);
    return null;
  }
};
tempdb.delete = tempdb.findOneAndDelete;
tempdb.collection = {
  drop: async () => {
    try {
      if (!global.SmdOfficial) {
        return;
      }
      if (isMongodb) {
        return await dbtemp.collection.drop();
      } else if (sqldb && pg) {
        return await pg.collection.drop("tempdb");
      } else {
        return await dbs.collection.drop("tempdb");
      }
    } catch (err) {
      console.log("Error while collection.drop all user in database,\n", err);
      return null;
    }
  }
};
module.exports = {
  tempdb: tempdb,
  pg: pg,
  dbs: dbs,
  groupdb: groupdb,
  userdb: userdb,
  alivedb: alivedb,
  bot_: alivedb
};
