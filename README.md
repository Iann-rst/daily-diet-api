# CRIANDO UMA API RESTFUL COM NODEJS

## DAILY DIET API
API para controle de dieta diária.


## Regras da aplicação
- [x] Deve ser possível criar um usuário;
- [x] Deve ser possível identificar o usuário entre as requisições (middleware para identificar o usuário);
- [x] Deve ser possível registar uma refeição feita, com as seguintes informações:
  - Nome;
  - Descrição;
  - Data e Hora;
  - Está dentro ou não da dieta;
- [ ] Deve ser possível editar uma refeição, podendo alterar todos os dados acima;
- [ ] Deve ser possível apagar uma refeição;
- [ ] Deve ser possível listar todas as refeições de um usuário;
- [ ] Deve ser possível visualizar uma única refeição (id);
- [ ] Deve ser possível recuperar as métricas de um usuário:
  - Quantidade total de refeições registradas;
  - Quantidade total de refeições dentro da dieta;
  - Quantidade total de refeições fora da dieta;
  - Melhor sequência por dia de refeições dentro da dieta;
- [ ] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou (middleware para identificar o usuário);