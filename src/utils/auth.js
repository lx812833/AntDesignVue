// 权限校验
const currentAuth = ["admin"]
export { currentAuth }

export function getCurrentAuthority() {
    return currentAuth   // 返回用户权限
}

export function check(authority) {
    const current = getCurrentAuthority()
    return current.some(item => authority.includes(item))  // 权限存在返回true
}

// 判断登录权限
export function isLogin() {
    const current = getCurrentAuthority()
    return current && current[0] != 'guest'
}