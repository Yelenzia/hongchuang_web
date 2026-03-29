export const passwordRule = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,20}$/

export const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value)
