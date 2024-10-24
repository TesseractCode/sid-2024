// controllers/cnpController.js

const CONTROL_CONSTANT = "279146358279";

// Controller function to validate CNP
exports.validateCNP = (req, res) => {
  const { cnp } = req.body;

  // Validate length
  if (!/^\d{13}$/.test(cnp)) {
    return res.status(400).json({ error: 'CNP must be exactly 13 digits long.' });
  }

  // Extract information from CNP
  const gender = extractGender(cnp[0]);
  let birthDate;
  try {
    birthDate = extractBirthDate(cnp);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid birth date in CNP.' });
  }
  const county = extractCounty(cnp.slice(7, 9));
  const sequenceNumber = cnp.slice(9, 12);
  const controlDigit = parseInt(cnp[12]);

  // Validate the control digit
  if (!isValidControlDigit(cnp, controlDigit)) {
    return res.status(400).json({ error: 'Invalid CNP. Control digit does not match.' });
  }

  // Return extracted information
  res.status(200).json({
    message: 'CNP is valid',
    gender,
    birthDate,
    county,
    sequenceNumber
  });
};

// Helper function to extract gender and century from the first digit
function extractGender(s) {
  const genderMapping = {
    '1': 'Male',
    '2': 'Female',
    '3': 'Male',
    '4': 'Female',
    '5': 'Male',
    '6': 'Female',
    '7': 'Male',
    '8': 'Female'
  };

  return genderMapping[s] || 'Unknown';
}

// Helper function to extract and validate birth date
function extractBirthDate(cnp) {
  const centuryMapping = {
    '1': 1900, '2': 1900, // 1900-1999
    '3': 1800, '4': 1800, // 1800-1899
    '5': 2000, '6': 2000  // 2000-2099
  };

  const century = centuryMapping[cnp[0]];
  const year = century + parseInt(cnp.slice(1, 3));
  const month = parseInt(cnp.slice(3, 5));
  const day = parseInt(cnp.slice(5, 7));

  // Validate date
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
    throw new Error('Invalid birth date.');
  }

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Helper function to extract county based on JJ code
function extractCounty(jj) {
  const countyMapping = {
    '01': 'Alba', '02': 'Arad', '03': 'Argeș', '04': 'Bacău', '05': 'Bihor', 
    '06': 'Bistrița-Năsăud', '07': 'Botoșani', '08': 'Brașov', '09': 'Brăila', 
    '10': 'Buzău', '11': 'Caraș-Severin', '12': 'Cluj', '13': 'Constanța',
    '14': 'Covasna', '15': 'Dâmbovița', '16': 'Dolj', '17': 'Galați', '18': 'Gorj', 
    '19': 'Harghita', '20': 'Hunedoara', '21': 'Ialomița', '22': 'Iași', 
    '23': 'Ilfov', '24': 'Maramureș', '25': 'Mehedinți', '26': 'Mureș', 
    '27': 'Neamț', '28': 'Olt', '29': 'Prahova', '30': 'Satu Mare', 
    '31': 'Sălaj', '32': 'Sibiu', '33': 'Suceava', '34': 'Teleorman', 
    '35': 'Timiș', '36': 'Tulcea', '37': 'Vaslui', '38': 'Vâlcea', 
    '39': 'Vrancea', '40': 'București', '41': 'București - Sector 1', 
    '42': 'București - Sector 2', '43': 'București - Sector 3', 
    '44': 'București - Sector 4', '45': 'București - Sector 5', 
    '46': 'București - Sector 6', '51': 'Călărași', '52': 'Giurgiu'
  };

  return countyMapping[jj] || 'Unknown county';
}

// Helper function to validate the control digit
function isValidControlDigit(cnp, controlDigit) {
  const controlConstant = CONTROL_CONSTANT.split('').map(Number);
  const sum = cnp
    .slice(0, 12)
    .split('')
    .map(Number)
    .reduce((acc, digit, index) => acc + digit * controlConstant[index], 0);

  const remainder = sum % 11;
  const expectedControlDigit = remainder < 10 ? remainder : 1;

  return expectedControlDigit === controlDigit;
}
