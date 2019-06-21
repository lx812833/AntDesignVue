function chart(method) {
    let res = null
    switch (method) {
        case 'GET':
            res = [50, 12, 40, 24, 14, 34]
            break;
        default:
            res = null
    }
    return res
}

module.exports = chart