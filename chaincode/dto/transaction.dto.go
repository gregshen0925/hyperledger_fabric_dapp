package dto

type CreateTransactionDto struct {
	Id           string  `json:"user_id"`
	IdKey        string  `json:"idkey"`
	Hash         string  `json:"hash"`
	Amount       float32 `json:"amount"`
	CurrencyType string  `json:"currency_type"`
	CreatedAt    string  `json:"created_at"`
}
