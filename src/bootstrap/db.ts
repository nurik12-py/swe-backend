import {connect} from "mongoose";

export default () => { 
    connect(
      "mongodb+srv://nurikuser:aAhgqHgx3zJ9UM2@cluster0.lso8k.mongodb.net/test?retryWrites=true&w=majority"
    )
    .then(() => console.log("Connected to db"))
    .catch((error) => console.error(error));
};
