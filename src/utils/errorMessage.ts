function capitalizeFirstLetter(value:string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  const ErrorMessages = {
    minLengthError: (field:string, size:number) => `Length of the ${field} should not be less than ${size}.`,
  
    maxLengthError: (field:string, size:number) => `Length of the ${field} should not be more than ${size}.`,
  
    startWithAlphabetError: (field:string) => `${capitalizeFirstLetter(field)} should start with an alphabet.`,
  
    startWithDigitError: (field:string) => `${capitalizeFirstLetter(field)} should start with a number.`,
  
    startWithAlphanumericError: (field:string) => `${capitalizeFirstLetter(field)} should start with an alphabet or a number.`,
  
    endWithAlphabetError: (field:string) => `${capitalizeFirstLetter(field)} should end with an alphabet.`,
  
    endWithDigitError: (field:string) => `${capitalizeFirstLetter(field)} should end with a number.`,
  
    endWithAlphanumericError: (field:string) => `${capitalizeFirstLetter(field)} should end with an alphabet or a number.`,
  
    nodeNameFormat: () => 'Node name can only contain alphabet, number, space and hyphen.',
  
    networkNameFormat: () => 'Network name can only contain alphabet, number, space and hyphen.',
  
    endpointNameFormat: () => 'Endpoint name can only contain alphabet, number, space and hyphen.',
  
    alphanumericFormat: (field:string) => `${capitalizeFirstLetter(field)} can only contain alphabet and number.`,
  
    emailFormat: () => 'Invalid email format.',
  
    alphanumericWithSpaceFormat: (field:string) => `${capitalizeFirstLetter(field)} can only contain alphabet , number and can not start or end with space.`,
  
    spaceError: () => 'Space not allowed.',
  
  };
  export default ErrorMessages;