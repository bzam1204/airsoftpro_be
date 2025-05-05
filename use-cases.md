A Clean Architecture, proposta por Robert C. Martin, organiza o sistema em camadas concêntricas que se separam por responsabilidade e nível de dependência. Uma das formas práticas de aplicá-la no início do desenvolvimento é dividir os requisitos em *casos de uso* (use cases), que são tratados como a camada de aplicação. Eles expressam os comportamentos do sistema com base nas ações e intenções dos usuários.

Abaixo, os requisitos do MVP do **Airsoft Pro** foram reorganizados em **casos de uso (use cases)** divididos por domínios, seguindo a ótica da Clean Architecture:

---

## 🔐 Autenticação e Perfis

### UC1 - Criar Conta de Usuário

[//]: # (* Entradas: nome completo, data de nascimento, e-mail, senha, foto 3x4, tipo de perfil)
* Validações: campos obrigatórios, e-mail único
* Saída: conta criada

### UC2 - Login no Sistema

* Entradas: e-mail, senha
* Validações: credenciais corretas
* Saída: sessão iniciada

### UC3 - Logout do Sistema

* Entrada: sessão ativa
* Saída: sessão encerrada

### UC4 - Recuperar Senha

* Entradas: e-mail
* Ação: envio de link para redefinição de senha

### UC5 - Editar Perfil de Jogador

* Entradas: username, bordão, foto 3x4
* Regras: username único

### UC6 - Alterar Tipo de Perfil

* Entrada: perfil de jogador → administrador (ou vice-versa)
* Regras: cada usuário pode ter apenas um perfil de cada tipo

---

## 🎮 Gestão de Partidas

### UC7 - Visualizar Lista de Partidas ✅

* Filtros: data, local, modo de jogo, nome do campo
* Saída: partidas disponíveis

### UC8 - Visualizar Detalhes de Partida ✅

* Entrada: ID da partida
* Saída: informações completas da partida e lista de participantes

### UC9 - Inscrever-se em Partida ✅

* Entrada: ID da partida
* Validações:

    * Horário da partida não iniciado
    * Jogador atende ao nível de honra mínimo
    * Partida ainda não atingiu o limite de participantes

### UC10 - Cancelar Participação em Partida ✅

* Entrada: ID da partida
* Ação: remover jogador da lista de participantes

### UC11 - Criar Partida ✅

* Perfil: administrador
* Entradas: dados completos da partida
* Regras: apenas em campos que o administrador possui

### UC12 - Editar Partida🧠

* Perfil: administrador
* Entrada: dados atualizados
* Validação: somente partidas futuras

### UC13 - Cancelar Partida

* Perfil: administrador
* Entrada: ID da partida

---

## 🏞 Gestão de Campos

### UC14 - Cadastrar Campo

* Perfil: administrador
* Entradas: nome, endereço, coordenadas, fotos, infraestrutura, regras

### UC15 - Editar Campo

* Perfil: administrador
* Entrada: dados atualizados
* Regra: somente em campos que administra

### UC16 - Visualizar Campos

* Entrada: nenhum ou filtros (ex: localização)
* Saída: lista de campos disponíveis

---

## 🚨 Sistema de Denúncias e Honra

### UC17 - Criar Denúncia

* Pré-condições:

    * Jogador denunciante e denunciado participaram da mesma partida
    * Partida já começou
    * Apenas uma denúncia por jogador por partida
* Entrada: ID da partida, ID do jogador denunciado, motivo
* Saída: denúncia registrada

### UC18 - Visualizar Histórico de Denúncias Feitas

* Entrada: ID do jogador
* Saída: lista de denúncias feitas

### UC19 - Visualizar Denúncias Recebidas

* Entrada: ID do jogador
* Saída: lista de denúncias recebidas

### UC20 - Avaliar Denúncia (Automático)

* Entrada: nova denúncia registrada
* Ação: algoritmo considera:

    * Reputação e frequência de denúncias do denunciante
    * Padrão de denúncias recebidas pelo denunciado
    * Tempo de cadastro dos envolvidos
* Saída: cálculo de impacto no nível de honra

### UC21 - Atualizar Nível de Honra

* Entrada: resultado da avaliação
* Regras:

    * Redução proporcional à gravidade
    * Máximo de 1 estrela por denúncia
    * Recuperação possível por bom comportamento

---

Esses casos de uso devem ser implementados na **camada de aplicação (Application Layer)** da Clean Architecture, e invocados por interfaces nos **controladores (Interface Adapters)**, que recebem dados das **interfaces de usuário (Framework & Drivers)**. A lógica de regras de negócio que não muda com interface ou infraestrutura (por exemplo, "só pode denunciar após a partida começar") deve residir na **camada de entidades (Enterprise Business Rules)**.

Deseja que eu monte um diagrama ou mapa visual com esses use cases organizados por domínio?
