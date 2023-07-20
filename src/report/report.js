import requiredParam from '../helpers/required-param';
import { InvalidPropertyError } from '../helpers/errors';
import isValidEmail from '../helpers/is-valid-email.js';
import upperFirst from '../helpers/upper-first';

export default function makeReport(
    reportInfo = requiredParam('reportInfo')
){
 
    const validReport = validate(reportInfo);
    const normalReport = normalize(validReport);
    return Object.freeze(normalReport);

    function validate ({
        // customer_id = requiredParam('customer_id'),
        // status = requiredParam('status'),
        ...otherInfo
      } = {}) {
        //validateName('surname', surname)
        //validateName('othernames', othernames)
        return {...otherInfo }
      }
    
      

      function normalize ({ ...otherInfo }) {
        return {
          ...otherInfo
        }
      }
}
