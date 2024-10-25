require('dotenv').config();
const axios = require('axios');
const { get_company_contacts } = require('../company_info/company_contacts.js');
const { get_company_description } = require('../company_info/company_description.js');
const { get_company_prediction } = require('../company_predictions/ai_prediction.js');
const { get_chatbot_answer } = require('../chatbot/chatbot.js');


exports.getCompanyContacts = async (req, res) => {
	console.log(req.body)

	const { company_name } = req.body;

	console.log(company_name);

	const contacts = await get_company_contacts(company_name)
  
  	res.status(200).json(contacts);
};

exports.getCompanyDescription = async (req, res) => {
  	const { company_name } = req.body;

	const description = await get_company_description(company_name)
  
  	res.status(200).json({ description : description });
};

exports.getAiPrediction = async (req, res) => {
  	const { company_name, cif } = req.body;

	const ai_prediction = await get_company_prediction(company_name, cif)
  
  	res.status(200).json({ ai_prediction : ai_prediction });
};

exports.getChatbotAnswer = async (req, res) => {
  	const { query } = req.body;

	const answer = await get_chatbot_answer(query)
  
  	res.status(200).json({ answer : answer });
};

//	Sa faci tu Iosif pentru Description si pentru Prediction (si sa-l verifici pe asta de Contacts :) )