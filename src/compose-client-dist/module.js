import {useEffect as $eUHoZ$useEffect, useState as $eUHoZ$useState} from "react";




//////////////////////////////////////////
// GLOBALS
//////////////////////////////////////////
const $22efd99dd59f6e00$var$COMPOSE_USER_CACHE_KEY = "compose-cache:user";
const $22efd99dd59f6e00$var$COMPOSE_TOKEN_KEY = "compose-token";
const $22efd99dd59f6e00$var$subscriptions = {
};
let $22efd99dd59f6e00$var$loggedInUser = null;
if (localStorage.getItem($22efd99dd59f6e00$var$COMPOSE_USER_CACHE_KEY)) $22efd99dd59f6e00$var$loggedInUser = $22efd99dd59f6e00$var$safeParseJSON(localStorage.getItem($22efd99dd59f6e00$var$COMPOSE_USER_CACHE_KEY));
const $22efd99dd59f6e00$var$loggedInUserSubscriptions = new Set();
const $22efd99dd59f6e00$var$ensureSet = (name)=>$22efd99dd59f6e00$var$subscriptions[name] = $22efd99dd59f6e00$var$subscriptions[name] || new Set()
;
const $22efd99dd59f6e00$var$callbacks = {
};
const $22efd99dd59f6e00$var$getCallbacks = (name)=>{
    return $22efd99dd59f6e00$var$callbacks[name] || [
        ()=>void 0
        ,
        ()=>void 0
    ];
};
let $22efd99dd59f6e00$var$socketOpen = false;
let $22efd99dd59f6e00$var$queuedMessages = [];
let $22efd99dd59f6e00$var$socket;
//////////////////////////////////////////
// UTILS
//////////////////////////////////////////
function $22efd99dd59f6e00$var$safeParseJSON(str) {
    if (!str) return null;
    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
}
function $22efd99dd59f6e00$var$send(data) {
    const requestId = (Math.random() + 1).toString(36).substring(7);
    return new Promise((resolve, reject)=>{
        $22efd99dd59f6e00$var$callbacks[requestId] = [
            resolve,
            reject
        ];
        if ($22efd99dd59f6e00$var$socketOpen) $22efd99dd59f6e00$var$actuallySend({
            ...data,
            requestId: requestId
        });
        else // TODO - after a while, close and try to reconnect
        // TODO - eventually, throw an error (promise throw)
        //        on all the places that pushed to this queue
        $22efd99dd59f6e00$var$queuedMessages.push({
            ...data,
            requestId: requestId
        });
    });
}
function $22efd99dd59f6e00$var$actuallySend(data) {
    try {
        $22efd99dd59f6e00$var$socket.send(JSON.stringify(data));
        $22efd99dd59f6e00$var$queuedMessages = $22efd99dd59f6e00$var$queuedMessages.filter((d)=>d.requestId !== data.requestId
        );
    } catch (e) {
        console.error(e);
    }
}
function $22efd99dd59f6e00$var$updateValue(name, value) {
    $22efd99dd59f6e00$var$ensureSet(name).forEach((callback)=>callback(value)
    );
// TODO - cache value in localstorage
}
// https://blog.trannhat.xyz/generate-a-hash-from-string-in-javascript/
const $22efd99dd59f6e00$var$hashCode = function(s) {
    return s.split("").reduce(function(a, b) {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
    }, 0);
};
//////////////////////////////////////////
// SETUP
//////////////////////////////////////////
// On page load, check if the URL contains the `magicLinkToken` param
const $22efd99dd59f6e00$var$magicLinkToken = new URLSearchParams(window.location.search).get("composeToken");
if ($22efd99dd59f6e00$var$magicLinkToken) $22efd99dd59f6e00$var$send({
    type: "LoginRequest",
    token: $22efd99dd59f6e00$var$magicLinkToken
});
//////////////////////////////////////////
// HANDLE SERVER RESPONSES
//////////////////////////////////////////
const $22efd99dd59f6e00$var$handleServerResponse = function(event) {
    const data = $22efd99dd59f6e00$var$safeParseJSON(event.data);
    if (!data) {
        console.error("Invalid JSON received from server");
        console.error(event);
        return;
    }
    if (data.type === "SubscribeResponse" || data.type === "UpdatedValueResponse") {
        if (data.type === "UpdatedValueResponse" && data.error) $22efd99dd59f6e00$var$getCallbacks(data.requestId)[1](`${data.name}: Cannot set this state because there is a reducer with the same name`);
        else {
            $22efd99dd59f6e00$var$getCallbacks(data.requestId)[0](data.value);
            $22efd99dd59f6e00$var$updateValue(data.name, data.value);
        }
    } else if (data.type === "LoginResponse") {
        if (data.token) {
            localStorage.setItem($22efd99dd59f6e00$var$COMPOSE_TOKEN_KEY, data.token);
            localStorage.setItem($22efd99dd59f6e00$var$COMPOSE_USER_CACHE_KEY, JSON.stringify(data.user));
            $22efd99dd59f6e00$var$loggedInUser = data.user || null;
            $22efd99dd59f6e00$var$getCallbacks(data.requestId)[0](data.user);
            $22efd99dd59f6e00$var$loggedInUserSubscriptions.forEach((callback)=>callback(data.user)
            );
        } else if (data.error) $22efd99dd59f6e00$var$getCallbacks(data.requestId)[1](data.error);
        else {
            // token already saved in localStorage, so just call the callback
            $22efd99dd59f6e00$var$loggedInUser = data.user || null;
            $22efd99dd59f6e00$var$getCallbacks(data.requestId)[0](data.user);
        }
    } else if (data.type === "ParseErrorResponse") {
        console.error("Sent invalid JSON to server");
        console.error(data.cause);
    } else if (data.type === "ResolveDispatchResponse") {
        $22efd99dd59f6e00$var$getCallbacks(data.requestId)[0](data.resolveValue);
        $22efd99dd59f6e00$var$updateValue(data.name, data.returnValue);
    } else if (data.type === "RuntimeDebugResponse") {
        data.consoles.forEach((log)=>console.log(`${data.name}: ${log}`)
        );
        if (data.error) console.error(`${data.name}\n\n${data.error.stack}`);
    } else console.warn(`Unknown response type from Compose server: ${data.type}`);
};
//////////////////////////////////////////
// Setup Websocket
//////////////////////////////////////////
const $22efd99dd59f6e00$var$handleSocketOpen = async ()=>{
    $22efd99dd59f6e00$var$socketOpen = true;
    if (localStorage.getItem($22efd99dd59f6e00$var$COMPOSE_TOKEN_KEY)) $22efd99dd59f6e00$var$send({
        type: "LoginRequest",
        token: localStorage.getItem($22efd99dd59f6e00$var$COMPOSE_TOKEN_KEY)
    });
    // maybe sending while awaiting to ensure ordering is overkill
    // we can definitely include local ordering inside the message itself
    for (const message of $22efd99dd59f6e00$var$queuedMessages)await $22efd99dd59f6e00$var$actuallySend(message);
};
const $22efd99dd59f6e00$var$handleSocketClose = function() {
    $22efd99dd59f6e00$var$socketOpen = false;
    setTimeout($22efd99dd59f6e00$var$setupWebsocket, 200);
};
function $22efd99dd59f6e00$var$setupWebsocket() {
    if ($22efd99dd59f6e00$var$socket) $22efd99dd59f6e00$var$socket.close();
    try {
        $22efd99dd59f6e00$var$socket = new WebSocket("ws://localhost:3000"); // TODO - point this to prod on releases
        $22efd99dd59f6e00$var$socket.addEventListener("message", $22efd99dd59f6e00$var$handleServerResponse);
        $22efd99dd59f6e00$var$socket.addEventListener("open", $22efd99dd59f6e00$var$handleSocketOpen);
        $22efd99dd59f6e00$var$socket.addEventListener("close", $22efd99dd59f6e00$var$handleSocketClose);
    } catch (e) {
        console.error(e);
    }
}
$22efd99dd59f6e00$var$setupWebsocket();
//////////////////////////////////////////
// Common: Cloud State & Reducer
//////////////////////////////////////////
function $22efd99dd59f6e00$var$useSubscription(name, setState) {
    $eUHoZ$useEffect(()=>{
        if (!$22efd99dd59f6e00$var$ensureSet(name).size) $22efd99dd59f6e00$var$send({
            type: "SubscribeRequest",
            name: name
        });
        $22efd99dd59f6e00$var$subscriptions[name].add(setState);
        return ()=>{
            $22efd99dd59f6e00$var$subscriptions[name].delete(setState);
            if (!$22efd99dd59f6e00$var$ensureSet(name).size) $22efd99dd59f6e00$var$socket.send(JSON.stringify({
                action: "unsubscribe",
                name: name
            }));
        };
    }, [
        setState
    ]);
}
function $22efd99dd59f6e00$export$ca1e6d392e234650(name, value) {
    $22efd99dd59f6e00$var$send({
        type: "StateUpdateRequest",
        name: name,
        value: value
    });
}
function $22efd99dd59f6e00$export$a94811eb228b1593(name, initialState) {
    const [state, setState] = $eUHoZ$useState(initialState);
    $22efd99dd59f6e00$var$useSubscription(name, setState);
    return [
        state,
        (s)=>$22efd99dd59f6e00$export$ca1e6d392e234650(name, s)
    ];
}
function $22efd99dd59f6e00$export$511ece507b5ccd06(name, event) {
    $22efd99dd59f6e00$var$send({
        type: "ReducerEventRequest",
        name: name,
        value: event
    });
}
function $22efd99dd59f6e00$export$f0ca8382c0b7cf66({ name: name , initialState: initialState , reducer: reducer  }) {
    const [state, setState] = $eUHoZ$useState(initialState);
    $22efd99dd59f6e00$var$useSubscription(name, setState);
    $eUHoZ$useEffect(()=>{
        $22efd99dd59f6e00$var$send({
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
        (s)=>$22efd99dd59f6e00$export$511ece507b5ccd06(name, s)
    ];
}
function $22efd99dd59f6e00$export$3d519b215a9cf630({ email: email , appName: appName , redirectURL: redirectURL  }) {
    redirectURL = redirectURL || window.location.href;
    return $22efd99dd59f6e00$var$send({
        type: "SendMagicLinkRequest",
        email: email,
        appName: appName,
        redirectURL: redirectURL
    });
}
function $22efd99dd59f6e00$export$23bbbc4533528f03() {
    const [user, setUser] = $eUHoZ$useState($22efd99dd59f6e00$var$loggedInUser);
    $eUHoZ$useEffect(()=>{
        $22efd99dd59f6e00$var$loggedInUserSubscriptions.add(setUser);
        return ()=>{
            $22efd99dd59f6e00$var$loggedInUserSubscriptions.delete(setUser);
        };
    }, []);
    return user;
}
function $22efd99dd59f6e00$export$a0973bcfe11b05c9() {
    localStorage.removeItem($22efd99dd59f6e00$var$COMPOSE_TOKEN_KEY);
    localStorage.removeItem($22efd99dd59f6e00$var$COMPOSE_USER_CACHE_KEY);
    $22efd99dd59f6e00$var$socket.send(JSON.stringify({
        type: "LogoutRequest"
    }));
}


export {$22efd99dd59f6e00$export$ca1e6d392e234650 as setCloudState, $22efd99dd59f6e00$export$a94811eb228b1593 as useCloudState, $22efd99dd59f6e00$export$511ece507b5ccd06 as dispatchCloudReducerEvent, $22efd99dd59f6e00$export$f0ca8382c0b7cf66 as useCloudReducer, $22efd99dd59f6e00$export$3d519b215a9cf630 as magicLinkLogin, $22efd99dd59f6e00$export$23bbbc4533528f03 as useUser, $22efd99dd59f6e00$export$a0973bcfe11b05c9 as logout};
//# sourceMappingURL=module.js.map
