const { create } = require("domain");
const db = require("./connection");
const { error } = require("console");

const userTable = 'userTable';
const adminTable = 'adminTable';
const officeAddressTable = 'officeAddressTable';
const homeAddressTable = 'homeAddressTable';
const currentAddressTable = 'currentAddressTable';

