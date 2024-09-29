const getIdByUrl = (pathname: any) => {
    var id = pathname.split('/')
    id = id[id?.length - 1]
    id = id.split('?')[0]
    id = id.split('-')
    id = id[id?.length - 1]
    return id;
}

export default getIdByUrl;