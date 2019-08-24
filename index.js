const express = require("express");

const server = express();

server.use(express.json());

let numberOfRequests = 0;

const project = [{ id: "1", title: "Novo Projeto1", task: [] }];

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd("Request");
});

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const checkProject = project.find(p => p.id == id);

  if (!checkProject) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

function logRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();
}

server.use(logRequests);

server.post("/project", (req, res) => {
  const { id, title } = req.body;

  const newProject = { id, title, task: [] };

  project.push(newProject);

  return res.json(newProject);
});

server.get("/project", (req, res) => {
  return res.json(project);
});

server.put("/project/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const newTitle = project.find(p => p.id == id);

  newTitle.title = title;

  return res.json(newTitle);
});

server.post("/project/:id/task", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  const addTaks = project.find(p => p.id == id);

  addTaks.task = task;

  return res.json(addTaks);
});

server.delete("/project/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectDel = project.findIndex(p => p.id == id);

  project.splice(projectDel, 1);

  return res.send();
});

server.listen(3000);
