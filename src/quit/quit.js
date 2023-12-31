import requiredParam from '../helpers/required-param';
import { InvalidPropertyError } from '../helpers/errors';
import isValidEmail from '../helpers/is-valid-email.js';
import upperFirst from '../helpers/upper-first';

export default function makeQuit(
    quitInfo = requiredParam('quitInfo')
){
    const validQuit = validate(quitInfo);
    const normalQuit= normalize(validQuit);
    return Object.freeze(normalQuit);

    function validate ({
      // name = requiredParam('name'),
      // email = requiredParam('email'),
      // phone = requiredParam('phone'),
      // message = requiredParam('message'),
        ...otherInfo
      } = {}) {
       // validateName('name', name);
        return {...otherInfo }
      }
    
      function validateName (label, name) {
        if (name.length < 2) {
          throw new InvalidPropertyError(
            `Contact ${label} must be at least 2 characters long.`
          )
        }
      }

      function normalize ({...otherInfo }) {
        return {
          ...otherInfo
        }
      }
}
