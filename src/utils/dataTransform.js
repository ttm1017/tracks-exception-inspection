/**
 * positionDataTransForm
 * function: make [91.0, 181.0, 31.3068, 121.78, 31.3066, 121.78] to be [[91.0, 181.0], [31.3068, 121.78], [31.3066, 121.78]]
 */
exports.transformPositionData= function (data) {
    const result = [];
    for (let i = 0; i < data.length; i += 2) {
        result.push([data[i], data[i + 1]]);
    }
    return result;
};