// eslint-disable-next-line import/no-anonymous-default-export
export default (validations)=>{
    let validationResult={
        isValid:true,
        errors:''
    }

    validations.map((validation)=>{
        validation.validate(validationResult);
    })
    return validationResult;
};