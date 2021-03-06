var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");
const assign = require("object-assign");

class OfficeStore extends FluxMapStore {
  getOffice (office_we_vote_id) {
      // if (!this.isLoaded()){ return undefined; }
      console.log("in getOffice, office_we_vote_id and office:", office_we_vote_id, this.getState().office[office_we_vote_id]);
      return this.getState().office[office_we_vote_id];
    }

  reduce (state, action) {

    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success)
      return state;

    switch (action.type) {

      case "officeRetrieve":
        console.log("officeRetrieve action.res", action.res);
        let office = action.res || {};
        console.log("in OfficeStore, officeRetrieve office:", office);
        return {
          ...state,
          office: assign({}, state.office, office )
        };


      case "voterBallotItemsRetrieve":
        let offices = {};
        action.res.ballot_item_list.forEach(one_ballot_item =>{
          if (one_ballot_item.kind_of_ballot_item === "OFFICE") {
            offices[one_ballot_item.we_vote_id] = one_ballot_item;
          }
        });

        return {
          ...state,
          offices: assign({}, state.offices, offices )
        };

      case "error-officeRetrieve":
        console.log(action);
        return state;

      default:
        return state;
    }

  }

}

module.exports = new OfficeStore(Dispatcher);
