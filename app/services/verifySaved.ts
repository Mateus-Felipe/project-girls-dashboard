const verifySaved = () => {
    var old: any = localStorage.getItem('savedmodels')
    if (!old) {
        old = [];
    } else {
        old = JSON.parse(old)
    }
    return old
}

export default verifySaved;