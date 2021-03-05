import { actionType } from '../../shared/actionType';

export const getVariants = (payload) => {
    return {
        type: actionType.VARIANTS_REQUEST,
        payload
    }
}

export const getVariantsSuccess = () => {
    return {
        type: actionType.VARIANTS_SUCCESS
    }
}

export const getVariantsFailure = () => {
    return {
        type: actionType.VARIANTS_FAILURE
    }
}