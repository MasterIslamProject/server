import requiredParam from '../helpers/required-param';
import { InvalidPropertyError } from '../helpers/errors';
import isValidEmail from '../helpers/is-valid-email.js';
import upperFirst from '../helpers/upper-first';

export default function makeTrending(
    trendingInfo = requiredParam('trendingInfo')
){
    
    const validTrending = validate(trendingInfo);
    const normalTrending = normalize(validTrending);
    return Object.freeze(normalTrending);

    function validate ({
        /*customer_id = requiredParam('customer_id'),
        payment_id = requiredParam('payment_id'),
        status = requiredParam('status'),*/
        ...otherInfo
    } = {}) {
        
        return { ...otherInfo }
    }

    /*function validateName (label, name) {
        if (name.length < 2) {
            throw new InvalidPropertyError(
            `Property's ${label} must be at least 2 characters long.`
            )
        }
    }*/

    function normalize ({...otherInfo }) {
        return {
            ...otherInfo
        }
    }

}
