const express = require("express");
const app = express();
const jp = require('jsonpath');
const cors = require('cors');
require("dotenv").config();
const yaml = require('yamljs');
const menuData = yaml.load('./menu.yaml');


const port = process.env.PORT || 5500;
app.listen(port, () => console.log(`listening at ${port}`));
app.use(cors());

// Main Menu
app.get('/mainmenu', function (req, res, next) {
  const menuItems = jp.query(menuData, '$.menus[0].items[*]');
  res.send(menuItems);
});

// Main Menu Queries
app.get('/mainmenu/:query', function (req, res, next) {
  let queryString = `'${req.params.query}'`;
  const menuItems = jp.query(menuData,`$.menus[0].items[?(@.name==${queryString})]`);
  res.send(menuItems);
  console.log("Main Request came");
});

// Main Menu Names
app.get('/mainmenunames', function (req, res, next) {
  const menuItems = jp.query(menuData, '$.menus[0].items[*].name');
  res.send(menuItems);
});


// Submenu Whole List
app.get('/submenu', function (req, res, next) {
  const menuItems = jp.query(menuData, '$.menus[1:]');
  res.send(menuItems);
});

// Submenu Queries
app.get('/submenu/:query', function (req, res, next) {
  let queryString = `'${req.params.query}'`;
  const menuItems = jp.query(menuData,`$.menus[?(@.key==${queryString})]`);
  res.send(menuItems);
  console.log("Sub Request came");
});


