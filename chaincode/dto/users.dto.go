package dto

type CreateUserDto struct {
	Id    string `json:"id"`
	IdKey string `json:"idkey"`
	Name  string `json:"name"`
	Email string `json:"email"`
}
type UpdateUserDto struct {
	Id    string `json:"id"`
	IdKey string `json:"idkey"`
	Name  string `json:"name"`
	Email string `json:"email"`
}
