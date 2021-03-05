const defaultState = {
    login: {
        userName: null,
        password: null,
        userInfo: {}
    },

    operationalStatus: {
        kpiData: [],
        editCardData: {
            dropDownValue: {
                geo: [],
                unitType: [],
                productLine: [],
                sku: []
            },
            selectedValue: {
                geo: "",
                unitType: "",
                productLine: "",
                sku: ""
            }

        }
    },

    responsiveGrid: {
        deletedGridItemIndex: null,
        visibleGridItemIndex: null,
        gridItemList: [],
    },

    joyRide: {
        runTour: false
    },

    personaData: null,

    users: [],

    userGroups: [],

    tableData: [],

    variants: {},

    communication: {
        isLocked: false,
        dropDownValue: 'product_base',
        selectedRowDetail: {},
        messages: [],
        totalMessages: 0,
        lastMessageObj: {},
        notification: [],
        filterDrawer: {
            checkedListTag: [],
            checkedListGroup: [],
            emails: "", //search by user emails
            startDate: "",
            endDate: "",
            text: "",
        }
    },

    jobRoles: [],

    systemRoles: [],

    userSettings: {},

    masterFilter: {
        productLine: "",
        region: "",
        planner: ""
    }

}

export default defaultState;