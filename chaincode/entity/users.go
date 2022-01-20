package entity

type User struct {
	Id          string        `json:"user_id"`
	IdKey       string        `json:"idkey"`
	Name        string        `json:"name"`
	Email       string        `json:"email"`
	Transaction []Transaction `json:"transaction"`
}
type GetUserList struct {
	IdKey string `json:"idkey"`
	Name  string `json:"name"`
	Email string `json:"email"`
}
type UpdateUser struct {
	IdKey string `json:"idkey"`
	Name  string `json:"name"`
	Email string `json:"email"`
}
type GetUserById struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	IdKey string `json:"idkey"`
}
type GetUserAndTxById struct {
	Name        string        `json:"name"`
	Email       string        `json:"email"`
	IdKey       string        `json:"idkey"`
	Transaction []Transaction `json:"transaction"`
}
