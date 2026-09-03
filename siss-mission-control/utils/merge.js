function deepMerge(target, source) {

    for (const key in source) {

        if (
            typeof source[key] === "object" &&
            source[key] !== null
        ) {

            if (!target[key]) {

                target[key] = {};

            }

            deepMerge(
                target[key],
                source[key]
            );

        }

        else {

            target[key] = source[key];

        }

    }

    return target;

}

function syncConfiguration(config, update) {

    return deepMerge(config, update);

}

module.exports = {

    syncConfiguration

};