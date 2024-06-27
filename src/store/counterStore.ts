import { makeAutoObservable } from "mobx"

export interface IUser {
    name: string
    age: number
    sex: string
}

class CounterStore {

    count = 0

    user: IUser = {
        name: 'filipp',
        age: 23,
        sex: 'man'
    }

    userList: IUser[] = [this.user]

    constructor() {
        makeAutoObservable(this)
    }

    setUser = (value: Partial<IUser>) => {
        this.user = {...this.user, ...value}
    }

    addUser = (value: IUser) => {
        this.userList = [...this.userList, value]
    }

    inc = (value: number) => {
        this.count += value
    }

    dec = (value: number) => {
        this.count -= value
    }

}

export default new CounterStore()