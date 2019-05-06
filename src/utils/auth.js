// 权限校验

export function getCurrentAuthority() {
    return ['admin']
}

export function check(authority) {
    const current = getCurrentAuthority()
    return current.some(item => authority.include(item))
}

export function isLogin() {
    const current = getCurrentAuthority()
    return current && current[0] != 'guest'
}