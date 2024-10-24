require('dotenv').config();
const axios = require('axios');


const get_company_contacts = require('../company_info/company_contacts.js');
exports.getCompanyContacts = async (req, res) => {
  	const { company_name } = req.body;

	const contacts = get_company_contacts(company_name)
  
  	res.status(200).json(contacts);
};

//	Sa faci tu Iosif pentru Description si pentru Prediction (si sa-l verifici pe asta de Contacts :) )