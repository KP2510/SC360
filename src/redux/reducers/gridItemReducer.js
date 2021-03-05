import { actionType } from '../../shared/actionType';
import defaultState from '../store/defaultState'
import { cloneDeep } from 'lodash';

const gridItemReducer = (state = defaultState.responsiveGrid, action) => {
    switch (action.type) {
        case actionType.GRID_ITEM_SUCCESS:
            return {
                ...state,
                gridItemList: action.payload
            };
        case actionType.GRID_ITEM_FAILURE:
            return {
                ...state,
                gridItemList: []
            };
        case actionType.TOGGLE_GRID_ITEM_SUCCESS:

            const updatedGridItems = cloneDeep(state).gridItemList.map( i => {
                if(i.cardId === action.payload.cardId){
                    i.isChecked = action.payload.isChecked
                }
                return i;
            });

            return {
                ...state,
                gridItemList: updatedGridItems
            };
        case actionType.TOGGLE_GRID_ITEM_FALIURE:
            return state;
        default:
            return state
    }
}

export default gridItemReducer;