const saveModel = async (id: any) => {
    if (!id) {
        return;
    }
    var old: string | any[] | any = localStorage.getItem('savedmodels')
    if (!old) {
        old = [];
    } else {
        old = JSON.parse(old)
    }

    if (old.includes(id)) {
        old = old.filter((v: any) => v != id)
    } else {
        old.push(id)
    }

    localStorage.setItem('savedmodels', JSON.stringify(old))
    return JSON.stringify(old)
}

export { saveModel }