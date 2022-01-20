export interface CreateUserDto {
  name: string
  email: string
  idkey: string
}
export interface UpdateUserDto {
  id: number
  name?: string
  email?: string
  idkey?: string
}
export interface CreateCCUserDto {
  id: string
  idkey: string
  name: string
  email: string
}
export interface UpdateCCUserDto {
  id: string
  idkey: string
  name: string
  email: string
}
