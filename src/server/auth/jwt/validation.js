import db from '../../db';

const jwtValidation = async (decoded, request, h) => {
  console.log('jwtValidation')
  console.log(" - - - - - - - decoded token:");
  console.log(decoded);
  console.log(" - - - - - - - request info:");
  console.log(request.info);
  console.log(" - - - - - - - user agent:");
  console.log(request.headers['user-agent']);

  // do your checks to see if the person is valid
  if (!db[decoded.id]) {
    return { isValid: false };
  } else {
    return { isValid : true };
  }
};

export default jwtValidation;
