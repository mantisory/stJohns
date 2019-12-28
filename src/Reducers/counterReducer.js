const counterReducer = (state={num:0},action)=>{

    switch (action.type){

        case "INCREMENT":
         return { num : state.num+1 }

        case "DECREMENT":
          return {num: state.num-1}

         default:
           return state
    }


}

export default counterReducer