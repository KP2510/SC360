export const api = {
    //GET Request
    LOGIN: '/login',
    GRID_ITEMS: '/cardDetails', //get list of grid card items along with visibility status
    KPI: '/kpi',
    GEO: '/filters/geo',
    PRODUCTLINE: '/filters/productLine',
    SKU: '/filters/sku',
    UNITTYPE: '/filters/unitType',
    GET_VARIANT: `/variants?persID=skuID&userID=${userID}`,


    //POST Request
    NEW_VARIANT: '/variants', //Same as put and delete,  pass the payload accordingly

    //PUT Request
    GRID_ITEMS_VISIBILITY: `/cardDetails/${cardId}`, //update show/hide status of grid card items
    MODIFY_VARIANT: '/variants', //Same as post and delete,  pass the payload accordingly
    MODIFY_BULK_VARIANT: '/bulkvariants',

    //DELETE Request
	DELETE_VARIANT: '/variants', //Same as put and post, pass the payload accordingly
};