export interface User {
    birthdate: any,
    contactNumber: number,
    description: string,
    localization: string,
    name: string,
    accountStatus: 'created' | 'waiting' | 'approved' | 'banned',
    priceFiftyMin: number,
    priceOneHour: number,
    priceOneHourAndMid: number,
    priceThirtyMin: number,
    priceTwoHour: number,
    priceAllNight: number,
    isAvaible: boolean,
    profileImageUrl: string | null,
    tags: string[] | [],
    nameId: string,
    id: string,
    created_at: any,
    Media: any[] | []
}