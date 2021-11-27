var $4Ik1T$react = require("react");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "setCloudState", () => $1286401b709de588$export$ca1e6d392e234650);
$parcel$export(module.exports, "useCloudState", () => $1286401b709de588$export$a94811eb228b1593);
$parcel$export(module.exports, "dispatchCloudReducerEvent", () => $1286401b709de588$export$511ece507b5ccd06);
$parcel$export(module.exports, "useCloudReducer", () => $1286401b709de588$export$f0ca8382c0b7cf66);
$parcel$export(module.exports, "magicLinkLogin", () => $1286401b709de588$export$3d519b215a9cf630);
$parcel$export(module.exports, "useUser", () => $1286401b709de588$export$23bbbc4533528f03);
$parcel$export(module.exports, "logout", () => $1286401b709de588$export$a0973bcfe11b05c9);



//////////////////////////////////////////
// GLOBALS
//////////////////////////////////////////
const $1286401b709de588$var$COMPOSE_USER_CACHE_KEY = "compose-cache:user";
const $1286401b709de588$var$COMPOSE_TOKEN_KEY = "compose-token";
const $1286401b709de588$var$subscriptions = {
};
let $1286401b709de588$var$loggedInUser = null;
if (localStorage.getItem($1286401b709de588$var$COMPOSE_USER_CACHE_KEY)) $1286401b709de588$var$loggedInUser = $1286401b709de588$var$safeParseJSON(localStorage.getItem($1286401b709de588$var$COMPOSE_USER_CACHE_KEY));
const $1286401b709de588$var$loggedInUserSubscriptions = new Set();
const $1286401b709de588$var$ensureSet = (name)=>$1286401b709de588$var$subscriptions[name] = $1286401b709de588$var$subscriptions[name] || new Set()
;
const $1286401b709de588$var$callbacks = {
};
const $1286401b709de588$var$getCallbacks = (name)=>{
    return $1286401b709de588$var$callbacks[name] || [
        ()=>void 0
        ,
        ()=>void 0
    ];
};
let $1286401b709de588$var$socketOpen = false;
let $1286401b709de588$var$queuedMessages = [];
let $1286401b709de588$var$socket;
//////////////////////////////////////////
// UTILS
//////////////////////////////////////////
function $1286401b709de588$var$safeParseJSON(str) {
    if (!str) return null;
    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
}
function $1286401b709de588$var$send(data) {
    const requestId = (Math.random() + 1).toString(36).substring(7);
    return new Promise((resolve, reject)=>{
        $1286401b709de588$var$callbacks[requestId] = [
            resolve,
            reject
        ];
        if ($1286401b709de588$var$socketOpen) $1286401b709de588$var$actuallySend({
            ...data,
            requestId: requestId
        });
        else // TODO - after a while, close and try to reconnect
        // TODO - eventually, throw an error (promise throw)
        //        on all the places that pushed to this queue
        $1286401b709de588$var$queuedMessages.push({
            ...data,
            requestId: requestId
        });
    });
}
function $1286401b709de588$var$actuallySend(data) {
    try {
        $1286401b709de588$var$socket.send(JSON.stringify(data));
        $1286401b709de588$var$queuedMessages = $1286401b709de588$var$queuedMessages.filter((d)=>d.requestId !== data.requestId
        );
    } catch (e) {
        console.error(e);
    }
}
function $1286401b709de588$var$updateValue(name, value) {
    $1286401b709de588$var$ensureSet(name).forEach((callback)=>callback(value)
    );
// TODO - cache value in localstorage
}
// https://blog.trannhat.xyz/generate-a-hash-from-string-in-javascript/
const $1286401b709de588$var$hashCode = function(s) {
    return s.split("").reduce(function(a, b) {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
    }, 0);
};
//////////////////////////////////////////
// SETUP
//////////////////////////////////////////
// On page load, check if the URL contains the `magicLinkToken` param
const $1286401b709de588$var$magicLinkToken = new URLSearchParams(window.location.search).get("composeToken");
if ($1286401b709de588$var$magicLinkToken) $1286401b709de588$var$send({
    type: "LoginRequest",
    token: $1286401b709de588$var$magicLinkToken
});
//////////////////////////////////////////
// HANDLE SERVER RESPONSES
//////////////////////////////////////////
const $1286401b709de588$var$handleServerResponse = function(event) {
    const data = $1286401b709de588$var$safeParseJSON(event.data);
    if (!data) {
        console.error("Invalid JSON received from server");
        console.error(event);
        return;
    }
    if (data.type === "SubscribeResponse" || data.type === "UpdatedValueResponse") {
        if (data.type === "UpdatedValueResponse" && data.error) $1286401b709de588$var$getCallbacks(data.requestId)[1](`${data.name}: Cannot set this state because there is a reducer with the same name`);
        else {
            $1286401b709de588$var$getCallbacks(data.requestId)[0](data.value);
            $1286401b709de588$var$updateValue(data.name, data.value);
        }
    } else if (data.type === "LoginResponse") {
        if (data.token) {
            localStorage.setItem($1286401b709de588$var$COMPOSE_TOKEN_KEY, data.token);
            localStorage.setItem($1286401b709de588$var$COMPOSE_USER_CACHE_KEY, JSON.stringify(data.user));
            $1286401b709de588$var$loggedInUser = data.user || null;
            $1286401b709de588$var$getCallbacks(data.requestId)[0](data.user);
            $1286401b709de588$var$loggedInUserSubscriptions.forEach((callback)=>callback(data.user)
            );
        } else if (data.error) $1286401b709de588$var$getCallbacks(data.requestId)[1](data.error);
        else {
            // token already saved in localStorage, so just call the callback
            $1286401b709de588$var$loggedInUser = data.user || null;
            $1286401b709de588$var$getCallbacks(data.requestId)[0](data.user);
        }
    } else if (data.type === "ParseErrorResponse") {
        console.error("Sent invalid JSON to server");
        console.error(data.cause);
    } else if (data.type === "ResolveDispatchResponse") {
        $1286401b709de588$var$getCallbacks(data.requestId)[0](data.resolveValue);
        $1286401b709de588$var$updateValue(data.name, data.returnValue);
    } else if (data.type === "RuntimeDebugResponse") {
        data.consoles.forEach((log)=>console.log(`${data.name}: ${log}`)
        );
        if (data.error) console.error(`${data.name}\n\n${data.error.stack}`);
    } else console.warn(`Unknown response type from Compose server: ${data.type}`);
};
//////////////////////////////////////////
// Setup Websocket
//////////////////////////////////////////
const $1286401b709de588$var$handleSocketOpen = async ()=>{
    $1286401b709de588$var$socketOpen = true;
    if (localStorage.getItem($1286401b709de588$var$COMPOSE_TOKEN_KEY)) $1286401b709de588$var$send({
        type: "LoginRequest",
        token: localStorage.getItem($1286401b709de588$var$COMPOSE_TOKEN_KEY)
    });
    // maybe sending while awaiting to ensure ordering is overkill
    // we can definitely include local ordering inside the message itself
    for (const message of $1286401b709de588$var$queuedMessages)await $1286401b709de588$var$actuallySend(message);
};
const $1286401b709de588$var$handleSocketClose = function() {
    $1286401b709de588$var$socketOpen = false;
    setTimeout($1286401b709de588$var$setupWebsocket, 200);
};
function $1286401b709de588$var$setupWebsocket() {
    if ($1286401b709de588$var$socket) $1286401b709de588$var$socket.close();
    try {
        $1286401b709de588$var$socket = new WebSocket("ws://localhost:3000"); // TODO - point this to prod on releases
        $1286401b709de588$var$socket.addEventListener("message", $1286401b709de588$var$handleServerResponse);
        $1286401b709de588$var$socket.addEventListener("open", $1286401b709de588$var$handleSocketOpen);
        $1286401b709de588$var$socket.addEventListener("close", $1286401b709de588$var$handleSocketClose);
    } catch (e) {
        console.error(e);
    }
}
$1286401b709de588$var$setupWebsocket();
//////////////////////////////////////////
// Common: Cloud State & Reducer
//////////////////////////////////////////
function $1286401b709de588$var$useSubscription(name, setState) {
    $4Ik1T$react.useEffect(()=>{
        if (!$1286401b709de588$var$ensureSet(name).size) $1286401b709de588$var$send({
            type: "SubscribeRequest",
            name: name
        });
        $1286401b709de588$var$subscriptions[name].add(setState);
        return ()=>{
            $1286401b709de588$var$subscriptions[name].delete(setState);
            if (!$1286401b709de588$var$ensureSet(name).size) $1286401b709de588$var$socket.send(JSON.stringify({
                action: "unsubscribe",
                name: name
            }));
        };
    }, [
        setState
    ]);
}
function $1286401b709de588$export$ca1e6d392e234650(name, value) {
    $1286401b709de588$var$send({
        type: "StateUpdateRequest",
        name: name,
        value: value
    });
}
function $1286401b709de588$export$a94811eb228b1593(name, initialState) {
    const [state, setState] = $4Ik1T$react.useState(initialState);
    $1286401b709de588$var$useSubscription(name, setState);
    return [
        state,
        (s)=>$1286401b709de588$export$ca1e6d392e234650(name, s)
    ];
}
function $1286401b709de588$export$511ece507b5ccd06(name, event) {
    $1286401b709de588$var$send({
        type: "ReducerEventRequest",
        name: name,
        value: event
    });
}
function $1286401b709de588$export$f0ca8382c0b7cf66({ name: name , initialState: initialState , reducer: reducer  }) {
    const [state, setState] = $4Ik1T$react.useState(initialState);
    $1286401b709de588$var$useSubscription(name, setState);
    $4Ik1T$react.useEffect(()=>{
        $1286401b709de588$var$send({
            type: "RegisterReducerRequest",
            name: name,
            reducerCode: reducer.toString(),
            initialState: initialState
        });
    }, [
        name,
        reducer.toString(),
        JSON.stringify(initialState)
    ]);
    return [
        state,
        (s)=>$1286401b709de588$export$511ece507b5ccd06(name, s)
    ];
}
function $1286401b709de588$export$3d519b215a9cf630({ email: email , appName: appName , redirectURL: redirectURL  }) {
    redirectURL = redirectURL || window.location.href;
    return $1286401b709de588$var$send({
        type: "SendMagicLinkRequest",
        email: email,
        appName: appName,
        redirectURL: redirectURL
    });
}
function $1286401b709de588$export$23bbbc4533528f03() {
    const [user, setUser] = $4Ik1T$react.useState($1286401b709de588$var$loggedInUser);
    $4Ik1T$react.useEffect(()=>{
        $1286401b709de588$var$loggedInUserSubscriptions.add(setUser);
        return ()=>{
            $1286401b709de588$var$loggedInUserSubscriptions.delete(setUser);
        };
    }, []);
    return user;
}
function $1286401b709de588$export$a0973bcfe11b05c9() {
    localStorage.removeItem($1286401b709de588$var$COMPOSE_TOKEN_KEY);
    localStorage.removeItem($1286401b709de588$var$COMPOSE_USER_CACHE_KEY);
    $1286401b709de588$var$socket.send(JSON.stringify({
        type: "LogoutRequest"
    }));
}


//# sourceMappingURL=main.js.map
