const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const NAME_REGEX = /^[a-zA-Z ]+$/;
const MOBILE_REGEX = /^\d*[.]?\d*$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const URL_REGEX = /^(ftp|http|https):\/\/[^ "]+$/;
const MAP_LINK =
  /^(https?:\/\/)?(www\.)?(google\.com\/maps|maps\.apple\.com|mapquest\.com)\/?[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/?))/;
const CHARACTER = /^.{200}$/;
const DECIMALNUMBER = /^[1-9][\.\d]*(,\d+)?$/;
const EXP_REGEX = /^\d+-\d+$/;


const PASSWORD_LENGTH_REGEX = /.{8,}/;
const UPPERCASE_REGEX = /[A-Z]/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

// max length check
export const maxLengthCheck = (object) => {
  if (object.target.value.length > object.target.maxLength) {
    object.target.value = object.target.value.slice(0, object.target.maxLength);
  }
};

// Mobile number regex
export function validMobile(mobile) {
  return MOBILE_REGEX.test(mobile);
}

export function validCharacter(character) {
  return CHARACTER.test(character);
}

// User name regex
export function validName(name) {
  return NAME_REGEX.test(name);
}

// User email regex
export function validEmail(emailid) {
  return EMAIL_REGEX.test(String(emailid).trim());
}

// User password regex
export function validPassword(password) {
  return PASSWORD_REGEX.test(String(password));
}

// User url regex
export function validUrl(url) {
  return URL_REGEX.test(url);
}

// User map regex
export function validMapUrl(mapUrl) {
  return MAP_LINK.test(mapUrl);
}

export function validExperience(exp) {
  return EXP_REGEX.test(exp);
}

export function isValidDecimal(value) {
  const parsedValue = parseFloat(value);
  return !isNaN(parsedValue) && isFinite(parsedValue);
}


export function isValidPassword(password) {
  if (!PASSWORD_LENGTH_REGEX.test(password) ||
    !UPPERCASE_REGEX.test(password) ||
    !SPECIAL_CHAR_REGEX.test(password)) {
    return 'Password must be at least 8 characters long, with 1 uppercase letter and 1 number.';
  }
  return null;
}

export function isValidPasswordNew(password) {
  if (!PASSWORD_LENGTH_REGEX.test(password) ||
    !UPPERCASE_REGEX.test(password) ||
    !SPECIAL_CHAR_REGEX.test(password)) {
    return 'Password must contain atleast 1 uppercase, 1 lowercase, 1 special character and 1 numeric characters. Minimum 8 characters.';
  }
  return null;
}