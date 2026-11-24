function deepMerge(target, source, session) {
    for (const key in source) {
        if (key === "__proto__") {
            // 전역 Object.prototype 오염 대신 세션에 저장
            if (!session.__pollution) session.__pollution = {};
            deepMerge(session.__pollution, source[key], session);
            continue;
        }
        if (typeof source[key] === "object" && source[key] !== null) {
            if (!target[key]) target[key] = {};
            deepMerge(target[key], source[key], session);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

function syncConfiguration(config, update, session) {
    return deepMerge(config, update, session);
}

module.exports = { syncConfiguration };