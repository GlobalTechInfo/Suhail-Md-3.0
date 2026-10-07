const axios = require("axios");
let koyeb_api = process.env.KOYEB_API;
let axiosConfig = {
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    Authorization: "Bearer " + koyeb_api
  }
};
async function get_deployments() {
  status = false;
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer " + koyeb_api
    }
  };
  await axios.get("https://app.koyeb.com/v1/deployments", config).then(result => {
    let badStatuses = ["STOPPED", "STOPPING", "ERROR", "ERRPRING"];
    let statuses = [];
    for (let i = 0; i < result.data.deployments.length; i++) {
      if (!badStatuses.includes(result.data.deployments[i].status)) {
        statuses.push(result.data.deployments[i].status);
      }
    }
    if (statuses.length > 1) {
      status = "true";
    }
  });
  return status;
}
function checkArray(env, key) {
  var found = false;
  for (var i = 0; i < env.length; i++) {
    if (env[i].key == key) {
      found = true;
      break;
    }
  }
  return found;
}
async function delvar(key) {
  var deleted = false;
  let {
    data: deployment
  } = await axios.get("https://app.koyeb.com/v1/services", axiosConfig);
  let serviceId = deployment.services[0].id;
  let response = await axios.get("https://app.koyeb.com/v1/deployments/" + deployment.services[0].latest_deployment_id, axiosConfig);
  let found = checkArray(response.data.deployment.definition.env, key);
  if (found !== true) {
    return "_No such env in koyeb._";
  }
  let removedEnv = [];
  for (var i = 0; i < response.data.deployment.definition.env.length; i++) {
    if (response.data.deployment.definition.env[i].key === key) {
      continue;
    }
    removedEnv.push(response.data.deployment.definition.env[i]);
  }
  let payload = {
    definition: {
      name: response.data.deployment.definition.name,
      routes: response.data.deployment.definition.routes,
      ports: response.data.deployment.definition.ports,
      env: removedEnv,
      regions: response.data.deployment.definition.regions,
      scalings: response.data.deployment.definition.scalings,
      instance_types: response.data.deployment.definition.instance_types,
      health_checks: response.data.deployment.definition.health_checks,
      docker: response.data.deployment.definition.docker
    }
  };
  await axios.patch("https://app.koyeb.com/v1/services/" + serviceId, payload, axiosConfig).then(result => {
    if (result.status === 200) {
      deleted = "_Successfully deleted " + key + " var from koyeb._";
    } else {
      deleted = "_Please put Koyeb api key in var KOYEB_API._\nEg: KOYEB_API:api key";
    }
  });
  return deleted;
}
async function change_env(envPair) {
  var usage = "_Please put Koyeb api key in var KOYEB_API._\nEg: KOYEB_API:api key";
  let {
    data: deployment
  } = await axios.get("https://app.koyeb.com/v1/services", axiosConfig);
  let serviceId = deployment.services[0].id;
  let response = await axios.get("https://app.koyeb.com/v1/deployments/" + deployment.services[0].latest_deployment_id, axiosConfig);
  let envKeyValue = envPair.split(":");
  let envPayload = [];
  for (var i = 0; i < response.data.deployment.definition.env.length; i++) {
    if (response.data.deployment.definition.env[i].key === envKeyValue[0]) {
      envPayload.push({
        scopes: ["region:fra"],
        key: "" + envKeyValue[0],
        value: "" + envKeyValue[1]
      });
    } else {
      envPayload.push(response.data.deployment.definition.env[i]);
    }
  }
  let found = checkArray(envPayload, envKeyValue[0]);
  if (!found === true) {
    envPayload.push({
      scopes: ["region:fra"],
      key: "" + envKeyValue[0],
      value: "" + envKeyValue[1]
    });
  }
  let patchPayload = {
    definition: {
      name: response.data.deployment.definition.name,
      routes: response.data.deployment.definition.routes,
      ports: response.data.deployment.definition.ports,
      env: envPayload,
      regions: response.data.deployment.definition.regions,
      scalings: response.data.deployment.definition.scalings,
      instance_types: response.data.deployment.definition.instance_types,
      health_checks: response.data.deployment.definition.health_checks,
      docker: response.data.deployment.definition.docker
    }
  };
  await axios.patch("https://app.koyeb.com/v1/services/" + serviceId, patchPayload, axiosConfig).then(result => {
    if (result.status === 200) {
      usage = "Successfuly changed var _" + envKeyValue[0] + ":" + envKeyValue[1] + " ._";
    } else {
      usage = "_Please put Koyeb api key in var KOYEB_API._\nEg: KOYEB_API:api key";
    }
  });
  return usage;
}
async function getallvar() {
  let {
    data: deployment
  } = await axios.get("https://app.koyeb.com/v1/services", axiosConfig);
  let response = await axios.get("https://app.koyeb.com/v1/deployments/" + deployment.services[0].latest_deployment_id, axiosConfig);
  let lines = [];
  for (var i = 0; i < response.data.deployment.definition.env.length; i++) {
    if (!response.data.deployment.definition.env[i].key) {
      continue;
    }
    lines.push("*" + response.data.deployment.definition.env[i].key + "* : _" + response.data.deployment.definition.env[i].value + "_");
  }
  return lines.join("\n");
}
async function getvar(key) {
  let {
    data: deployment
  } = await axios.get("https://app.koyeb.com/v1/services", axiosConfig);
  let response = await axios.get("https://app.koyeb.com/v1/deployments/" + deployment.services[0].latest_deployment_id, axiosConfig);
  for (var i = 0; i < response.data.deployment.definition.env.length; i++) {
    if (!response.data.deployment.definition.env[i].key) {
      continue;
    }
    if (response.data.deployment.definition.env[i].key === key) {
      return response.data.deployment.definition.env[i].key + ":" + response.data.deployment.definition.env[i].value;
    }
  }
}
async function redeploy() {
  var redeployed = false;
  var config = {
    deployment_group: "prod",
    sha: ""
  };
  let {
    data: deployment
  } = await axios.get("https://app.koyeb.com/v1/services", axiosConfig);
  let serviceId = deployment.services[0].id;
  try {
    let result = await axios.post("https://app.koyeb.com/v1/services/" + serviceId + "/redeploy", config, axiosConfig);
    redeployed = "_update started._";
  } catch (err) {
    redeployed = "*Got an error in redeploying.*\n*Please put koyeb api key in var KOYEB_API.*\n_Eg: KOYEB_API:api key from https://app.koyeb.com/account/api ._";
  }
  return redeployed;
}
module.exports = {
  redeploy: redeploy,
  getvar: getvar,
  delvar: delvar,
  getallvar: getallvar,
  change_env: change_env,
  get_deployments: get_deployments
};
