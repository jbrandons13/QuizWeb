import Pusher from "pusher-js";

const pusher = new Pusher("0e9698b1be0060e188cc",{
    cluster: 'ap3',
});
export default pusher;