package smartcontract

import (
	"chaincode/dto"
	"chaincode/entity"
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	return nil
}

func (s *SmartContract) GetUserList(ctx contractapi.TransactionContextInterface) ([]entity.GetUserList, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var users []*entity.GetUserList
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var user entity.GetUserList
		err = json.Unmarshal(queryResponse.Value, &user)
		if err != nil {
			return nil, err
		}
		users = append(users, &user)
	}
	var userList []entity.GetUserList
	for i := 0; i < len(users); i++ {
		var address = users[i]
		userList = append(userList, *address)
	}

	return userList, nil
}

func (s *SmartContract) UserExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}
	return assetJSON != nil, nil
}

func (s *SmartContract) CreateUser(ctx contractapi.TransactionContextInterface, payload dto.CreateUserDto) error {
	exists, err := s.UserExists(ctx, payload.IdKey)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the user %s already exists", payload.IdKey)
	}

	user := entity.User{
		IdKey:       payload.IdKey,
		Name:        payload.Name,
		Email:       payload.Email,
		Transaction: []entity.Transaction{},
	}
	userJson, err := json.Marshal(user)
	if err != nil {
		return err
	}
	ctx.GetStub().PutState(payload.Id, userJson)

	return nil
}

func (s *SmartContract) GetUserById(ctx contractapi.TransactionContextInterface, id string) (*entity.GetUserById, error) {
	userJson, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if userJson == nil {
		return nil, fmt.Errorf("the user %s does not exist", id)
	}

	var user entity.GetUserById
	err = json.Unmarshal(userJson, &user)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *SmartContract) UpdateUser(ctx contractapi.TransactionContextInterface, payload dto.UpdateUserDto) error {
	user, err := s.GetUserById(ctx, payload.Id)
	if err != nil {
		return err
	}
	user.Email = payload.Email
	user.Name = payload.Name
	userJson, err := json.Marshal(user)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(payload.Id, userJson)
}

func (s *SmartContract) CreateTransaction(ctx contractapi.TransactionContextInterface, payload dto.CreateTransactionDto) error {
	user, err := s.GetUserAndTxById(ctx, payload.Id)
	if err != nil {
		return err
	}
	if user == nil {
		return fmt.Errorf("the user %s does not exists", payload.Id)
	}
	transaction := entity.Transaction{
		Hash:         payload.Hash,
		Amount:       payload.Amount,
		CurrencyType: payload.CurrencyType,
		CreatedAt:    payload.CreatedAt,
	}
	user.Transaction = append(user.Transaction, transaction)
	userJson, err := json.Marshal(user)
	if err != nil {
		return err
	}
	ctx.GetStub().PutState(payload.Id, userJson)

	return nil
}

func (s *SmartContract) GetUserAndTxList(ctx contractapi.TransactionContextInterface) ([]entity.User, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var users []*entity.User
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var user entity.User
		err = json.Unmarshal(queryResponse.Value, &user)
		if err != nil {
			return nil, err
		}
		users = append(users, &user)
	}
	var userList []entity.User
	for i := 0; i < len(users); i++ {
		var address = users[i]
		userList = append(userList, *address)
	}

	return userList, nil
}

func (s *SmartContract) GetUserAndTxById(ctx contractapi.TransactionContextInterface, id string) (*entity.User, error) {
	userJson, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if userJson == nil {
		return nil, fmt.Errorf("the user %s does not exist", id)
	}

	var user entity.User
	err = json.Unmarshal(userJson, &user)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *SmartContract) TxHashExists(ctx contractapi.TransactionContextInterface, hash string) (bool, error) {
	users, err := s.GetUserAndTxList(ctx)
	if err != nil {
		return false, err
	}
	for i := range users {
		for j := range users[i].Transaction {
			if users[i].Transaction[j].Hash == hash {
				return true, nil
			}
		}
	}
	return false, nil
}
