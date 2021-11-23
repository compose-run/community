import {useEffect as $eUHoZ$useEffect, useState as $eUHoZ$useState} from "react";




// Create WebSocket connection
const $22efd99dd59f6e00$var$socket = new WebSocket("ws://localhost:3000");
// utils
function $22efd99dd59f6e00$var$safeParseJSON(str) {
    if (!str) return null;
    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
}
function $22efd99dd59f6e00$var$send(data) {
    if ($22efd99dd59f6e00$var$socketOpen) $22efd99dd59f6e00$var$socket.send(JSON.stringify(data));
    else $22efd99dd59f6e00$var$queuedMessages.push(data);
}
// https://blog.trannhat.xyz/generate-a-hash-from-string-in-javascript/
const $22efd99dd59f6e00$var$hashCode = function(s) {
    return s.split("").reduce(function(a, b) {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
    }, 0);
};
// globals
const $22efd99dd59f6e00$var$subscriptions = {
};
let $22efd99dd59f6e00$var$loggedInUser = null;
if (localStorage.getItem("ComposeCachedUser")) $22efd99dd59f6e00$var$loggedInUser = $22efd99dd59f6e00$var$safeParseJSON(localStorage.getItem("ComposeCachedUser"));
const $22efd99dd59f6e00$var$loggedInUserSubscriptions = new Set();
const $22efd99dd59f6e00$var$ensureSet = (name)=>$22efd99dd59f6e00$var$subscriptions[name] = $22efd99dd59f6e00$var$subscriptions[name] || new Set()
;
const $22efd99dd59f6e00$var$magicLinkLoginCallbacks = {
};
//////////////////////////////////////////
// SETUP
//////////////////////////////////////////
// On page load, check if the URL contains the `magicLinkToken` param
const $22efd99dd59f6e00$var$magicLinkToken = new URLSearchParams(window.location.search).get("ComposeMagicLinkToken");
if ($22efd99dd59f6e00$var$magicLinkToken) $22efd99dd59f6e00$var$send({
    type: "LoginRequest",
    token: $22efd99dd59f6e00$var$magicLinkToken
});
let $22efd99dd59f6e00$var$socketOpen = false;
const $22efd99dd59f6e00$var$queuedMessages = [];
$22efd99dd59f6e00$var$socket.addEventListener("open", function(event) {
    $22efd99dd59f6e00$var$socketOpen = true;
    $22efd99dd59f6e00$var$queuedMessages.forEach($22efd99dd59f6e00$var$send);
    if (localStorage.getItem("compose-token")) $22efd99dd59f6e00$var$send({
        type: "LoginRequest",
        token: localStorage.getItem("compose-token")
    });
});
$22efd99dd59f6e00$var$socket.addEventListener("close", function(event) {
    $22efd99dd59f6e00$var$socketOpen = false;
// TODO - reopen socket
});
//////////////////////////////////////////
// HANDLE SERVER RESPONSES
//////////////////////////////////////////
$22efd99dd59f6e00$var$socket.addEventListener("message", function(event) {
    const data = $22efd99dd59f6e00$var$safeParseJSON(event.data);
    if (!data) {
        console.error("Invalid JSON received from server");
        console.error(event);
        return;
    }
    if (data.type === "SubscribeResponse" || data.type === "UpdatedValueResponse") $22efd99dd59f6e00$var$ensureSet(data.name).forEach((callback)=>callback(data.value)
    );
    else if (data.type === "LoginResponse") {
        if (data.token) {
            localStorage.setItem("compose-token", data.token);
            $22efd99dd59f6e00$var$loggedInUser = data.user || null;
            $22efd99dd59f6e00$var$magicLinkLoginCallbacks[data.requestId]?.[0](data.user);
        } else if (data.error) $22efd99dd59f6e00$var$magicLinkLoginCallbacks[data.requestId]?.[1](data.error);
        else {
            // token already saved in localStorage, so just call the callback
            $22efd99dd59f6e00$var$loggedInUser = data.user || null;
            $22efd99dd59f6e00$var$magicLinkLoginCallbacks[data.requestId]?.[0](data.user);
        }
    } else if (data.type === "ParseErrorResponse") {
        console.error("Sent invalid JSON to server");
        console.error(data.cause);
    }
});
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
    $22efd99dd59f6e00$var$socket.send(JSON.stringify({
        action: "update",
        name: name,
        value: value
    }));
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
function $22efd99dd59f6e00$export$f0ca8382c0b7cf66({ name: name , initialState: initialState , reducer: reducer , isPrivate: isPrivate = true  }) {
    const [state, setState] = $eUHoZ$useState(initialState);
    $22efd99dd59f6e00$var$useSubscription(name, setState);
    $eUHoZ$useEffect(()=>{
        console.log();
        $22efd99dd59f6e00$var$send({
            type: "RegisterReducerRequest",
            name: name,
            reducerCode: reducer.toString(),
            isPrivate: isPrivate,
            initialState: initialState
        });
    }, [
        name,
        reducer.toString(),
        isPrivate,
        JSON.stringify(initialState)
    ]);
    return [
        state,
        (s)=>$22efd99dd59f6e00$export$511ece507b5ccd06(name, s)
    ];
}
//////////////////////////////////////////
// USER & AUTH
//////////////////////////////////////////
function $22efd99dd59f6e00$var$magicLinkLogin({ email: email , appName: appName , redirectUrl: redirectUrl  }) {
    const requestId = Math.random().toString();
    const promise = new Promise((resolve, reject)=>{
        $22efd99dd59f6e00$var$magicLinkLoginCallbacks[requestId] = [
            resolve,
            reject
        ];
    });
    redirectUrl = redirectUrl || window.location.href;
    $22efd99dd59f6e00$var$socket.send(JSON.stringify({
        action: "MagicLinkLogin",
        email: email,
        appName: appName,
        redirectUrl: redirectUrl,
        requestId: requestId
    }));
    return promise;
}
function $22efd99dd59f6e00$export$aae23f3a65fbe750() {
    const [user, setUser] = $eUHoZ$useState(null);
    $eUHoZ$useEffect(()=>{
        $22efd99dd59f6e00$var$loggedInUserSubscriptions.add(setUser);
        return ()=>{
            $22efd99dd59f6e00$var$loggedInUserSubscriptions.delete(setUser);
        };
    }, []);
    return user;
}
function $22efd99dd59f6e00$export$a0973bcfe11b05c9() {
    localStorage.removeItem("compose-token");
    $22efd99dd59f6e00$var$socket.send(JSON.stringify({
        type: "LogoutRequest"
    }));
}


export {$22efd99dd59f6e00$export$ca1e6d392e234650 as setCloudState, $22efd99dd59f6e00$export$a94811eb228b1593 as useCloudState, $22efd99dd59f6e00$export$511ece507b5ccd06 as dispatchCloudReducerEvent, $22efd99dd59f6e00$export$f0ca8382c0b7cf66 as useCloudReducer, $22efd99dd59f6e00$export$aae23f3a65fbe750 as useLoggedInUser, $22efd99dd59f6e00$export$a0973bcfe11b05c9 as logout};
//# sourceMappingURL=module.js.map
