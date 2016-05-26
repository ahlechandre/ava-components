# Introdução

O `tester` é um componente de interface para manipular testes.

Um `tester` contém múltiplas questões ordenadas. Cada questão (ou teste) é composta por um **número**, **título**, **descrição**, **suporte**, **conteúdo** e **ações**. 

O **número** é o índice de ordem da questão no `tester` (1, 2, 3... N). O número é inserido automaticamente pelo componente seguindo a ordem das questões na marcação (HTML).

O **título** deve ser breve. Recomendamos que utilize o título para indicar a disciplina da questão. 

O **suporte** é um recurso opcional que pode estar em cada questão. O recurso consiste em um botão que pode ser acionado pelo usuário para visualizar conteúdo extra, imagens, ajuda, entre outros.

A **descrição** pode ser longa e deve contemplar o enunciado do teste. 

O **conteúdo** de um teste deve conter as entradas de dados (alternativas da questão) a serem disponibilizadas para o usuário.

Existem 3 **ações** possíves e elas são representadas por botões na parte inferior do teste. 

* Completar/Responder: Acionada pelo usuário com a finalidade de responder a um teste (questão). Após completar uma questão, o `tester` é avançado para o próximo teste não respondido ainda. 

* Voltar: Acionada pelo usuário com a finalidade de voltar ao primeiro teste anterior ao atual que não esteja completo (respondido) ainda.

* Pular: Acionada pelo usuário com a finalidade de avançar ao primeiro teste próximo ao atual que não esteja completo (respondido) ainda.

# Como usar

Para criar um componente `tester`, incie uma lista:

```html
<ul class="ava-tester">
  <!-- (...) -->
</ul>
```

Cada item da lista representa um teste (questão). Adicione os testes com a classe `ava-test`:

```html
<ul class="ava-tester">
  <li class="ava-test"></li>
  <li class="ava-test"></li>
  <li class="ava-test"></li>  
</ul>
```

Para cada teste, adicione um *label* com **título**, **descrição** e **suporte (opcional)**.  


```html
<ul class="ava-tester">
  <li class="ava-test">
    <!-- label -->
    <div class="ava-test__label">
      <div class="ava-test__label-title">
        <h1 class="ava-test__label-title-text">Título breve da questão.</h1>
        <p class="ava-test__label-description">Enunciado completo da questão.</p>
      </div>
      <span class="ava-test__label-support">
        <a href="#">
          <i class="material-icons">help</i>
        </a>
      </span>

    </div>
    <!-- conteúdo -->
    <!-- ações -->
  </li>
</ul>
```

Após o *label*, adicione o **conteúdo** da questão com a classe `ava-test__content`:


```html
<ul class="ava-tester">
  <li class="ava-test">
    
    <!-- label -->
    <div class="ava-test__label">
      <div class="ava-test__label-title">
        <h1 class="ava-test__label-title-text">Título breve da questão.</h1>
        <p class="ava-test__label-description">Enunciado completo da questão.</p>
      </div>
      <span class="ava-test__label-support">
        <a href="#">
          <i class="material-icons">help</i>
        </a>
      </span>

    </div>
    
    <!-- conteúdo -->
    <div class="ava-test__content">
      <!-- Todos os inputs aqui. -->
    </div>
    
    <!-- ações -->
  </li>
</ul>
```

Em seguida, adicione as ações da questão. Use os datasets: 

* Completar/responder: `data-test-complete`. 

* Voltar: `data-test-back`. 

* Pular: `data-test-skip`:

```html
<ul class="ava-tester">
  <li class="ava-test">
    
    <!-- label -->
    <div class="ava-test__label">
      <div class="ava-test__label-title">
        <h1 class="ava-test__label-title-text">Título breve da questão.</h1>
        <p class="ava-test__label-description">Enunciado completo da questão.</p>
      </div>
      <span class="ava-test__label-support">
        <a href="#">
          <i class="material-icons">help</i>
        </a>
      </span>

    </div>
    
    <!-- conteúdo -->
    <div class="ava-test__content">
      <!-- Todos os inputs aqui. -->
    </div>
    
    <!-- ações -->
    <div class="ava-test__actions">
      <!-- Completar. -->
      <button type="button" class="ava-button btn waves-effect" data-test-complete>Responder</button>
      
      <!-- Pular. -->
      <button type="button" class="ava-button ava-button--flat btn-flat waves-effect" data-test-skip>Pular</button>
      
      <!-- Voltar. -->
      <button type="button" class="ava-button ava-button--flat btn-flat waves-effect" data-test-back>Voltar</button>
    </div>

  </li>
</ul>
```

> As classes usadas nos botões não tem efeito funcional apenas visual.

# Classes

Class | Efeito | Observação
------|--------|-----------
`ava-tester` | Define um componente de tester | Obrigatória
`ava-test` | Define uma questão no tester | Obrigatória
`is-active` | Define uma questão como ativa ao iniciar o componente. Por padrão, a primeira é selecionada como ativa. Deve estar junto com `.ava-test`.  | Opcional
`is-completed` | Define uma questão como completa/respondida ao iniciar o componente. Deve estar junto com `.ava-test`. | Opcional
`ava-test__label` | Define o label de questão no tester | Obrigatória
`ava-test__label-title` | Define a seção do label destinada a descrição textual da questão. Deve estar dentro do de `.ava-test__label` | Obrigatória
`ava-test__label-title-text` | Define o título da questão. Deve estar dentro do de `.ava-test__label-title` | Obrigatória
`ava-test__label-description` | Define a descrição (enunciado) da questão. Deve estar dentro do de `.ava-test__label-title` | Obrigatória
`ava-test__label-support` | Define o recurso de suporte da questão. Deve estar dentro do de `.ava-test__label` | Obrigatória
`ava-test__label-indicator` | Define a seção parao o número da questão. Deve estar dentro do de `.ava-test__label` | Automático
`ava-test__label-indicator-item` | Define o número da questão. Deve estar dentro do de `.ava-test__label-indicator` | Automático
`ava-test__content` | Define a seção destinada ao conteúdo da questão. | Obrigatório
`ava-test__actions` | Define a seção destinada às ações da questão. | Obrigatório


# API Javascript

Para acessar os métodos do componente, instancie:

```js 
var testerElement = document.querySelector('ul.ava-tester');
// Acesse a instância do componente.
var tester = testerElement.AvaTester;
```

Método | Efeito | Parâmetros | Retorno
---|---|---
`isActive(test)` | Verifica se uma questão está ativa. | test: <code>HTMLElement &#124; number</code> | `boolean`
`isCompleted(test)` | Verifica se uma questão está completa/respondida. | test: <code>HTMLElement &#124; number</code> | `boolean`
`setActive(test)` | Define uma questão como ativa. | test: <code>HTMLElement &#124; number</code> | `boolean`
`getActive()` | Retorna a questão ativa. |  | <code>HTMLElement &#124; null</code>
`getActiveIndex()` | Retorna o índice da questão ativa. |  | `number`
`getTestElementByIndex(index)` | Retorna o elemento da questão do índice escolhido. | index: `number` | <code>HTMLElement &#124; null</code>
`getTestIndexByElement(element)` | Retorna o índice da questão do elemento escolhido. | element: `HTMLElement` | <code>number &#124; null</code>
`searchIndex(base, top, direction)` | Retorna o índice da primeira questão que precisa ser completa/respondida com base na base, topo e direção da busca. | base: <code>number &#124; undefined</code>, top: <code>number &#124; undefined</code>, direction: <code>string &#124; undefined</code>, | <code>number &#124; null</code>
`complete()` | Define a questão atual (ativa) como completa/respondida e avança para a próxima questão. |  | `boolean`
`back()` | Volta para a primeira questão anterior que deve ser completa/respondida. |  | `boolean`
`skip()` | Avança para a primeira questão posterior que deve ser completa/respondida. |  | `boolean`
`goto(index)` | Define a questão do índice escolhido como ativa. Se a questão estiver respondida, seu estado é restaurado para *não respondida*. | index: `number` | `boolean`
`getTestsSize()` | Retorna a quantidade de questões no `tester`. |  | `number`
`getTotalCompleted()` | Retorna a quantidade absoluta de questões completas/respondidas. |  | `number`
`getTotalCompletedRelative()` | Retorna a quantidade relativa (percentual) de questões completas/respondidas. |  | `number`
`getTestsList()` | Retorna a lista de questões associadas por índice => elemento. |  | `object`
`isAllCompleted()` | Verifica se todas as questões estão completas/respondidas. |  | `boolean`

# Eventos

Evento | Alvo | Expedido
-------|------|----------
`onback` | `.ava-test` | Quando o botão de voltar (`[data-test-back]`) é clicado. 
`oncomplete` | `.ava-test` | Quando o botão de responder/completar (`[data-test-complete]`) é clicado. 
`onskip` | `.ava-test` | Quando o botão de pular (`[data-test-skip]`) é clicado. 
`onsupport` | `.ava-test` | Quando a área de suporte (`.ava-test__label-support`) é clicada. 
`onend` | `.ava-tester` | Quando todas as questões do `tester` são completas/respondidas. 

# Exemplo de uso

Considere: 
```js 
var testerElement = document.querySelector('ul.ava-tester');
// Acesse a instância do componente.
var tester = testerElement.AvaTester;
```

## Acessando informações

### Questão ativa

```js
var element = tester.getActive(); // <li class="ava-test is-active">...</li>
var index = tester.getActiveIndex(); // 3
tester.isActive(element); // true
tester.isActive(index); // true
tester.isActive(4); // false
```

### Verificando questões respondidas
```js
var tests = tester.getTestsList(); // {1: <li class="ava-test">...</li>, ...}
tester.isCompleted(tests[1]); // true
tester.isCompleted(tests[2]); // true
tester.isCompleted(tests[3]); // true
tester.isCompleted(tests[4]); // false
tester.isAllCompleted(); // false
tester.getTestsSize(); // 4
tester.getTotalCompleted(); // 3
tester.getTotalCompletedRelative(); // 75
```

### Procurando por questões
```js
// Considere o tester com 4 questões e nenhuma respondida ainda. A questão 1 está ativa.

var element = tester.getActive(); // <li class="ava-test is-active">...</li>
var index = tester.getActiveIndex(); // 1
tester.getTestElementByIndex(index); // <li class="ava-test is-active">...</li>
tester.getTestElementByIndex(0); // null
tester.getTestIndexByElement(element); // 1

// Define questão 3 como ativa.
tester.goto(3); // true
// Define a questão atual (3) como completa/respondida.
tester.complete();
// Procura próxima que precisa ser respondida a partir do início. Busca para frente (por padrão).
tester.searchIndex(); // 1
tester.searchIndex(2, 4); // 2
tester.searchIndex(3, 4); // 4
tester.searchIndex(0, 4, 'next'); // 1
tester.searchIndex(0, 4, 'back'); // 4
tester.searchIndex(0, 3, 'next'); // 1
tester.searchIndex(0, 3, 'back'); // 2
tester.goto(1); // true
tester.searchIndex(0, 1, 'back'); // 1
tester.complete(); // true
tester.searchIndex(0, 1, 'back'); // 4
```

### Última questão
```js
if ((tester.getTestsSize() - tester.getTotalCompleted()) === 1) {
  // Está na última questão.
}

if (!tester.skip() && !tester.isAllCompleted()) {
  // Tentando pular última questão.
} 

if (!tester.back() && !tester.isAllCompleted()) {
  // Tentando voltar última questão.
} 

```

## Responder 
```js
var tests = tester.getTestsList();
// Evento disparado quando usuário responder primeira questão.
tests[1].addEventListener('oncomplete', function (event) {
  
  // Verifica se alguma alternativa foi preenchida.
  if (true) {
    // Completa a questão e avança o tester.
    tester.complete();
  } else {
    alert('Escolha uma alternativa.');  
  }
});
```

## Voltar questão
```js
var tests = tester.getTestsList();
// Evento disparado quando usuário clicar no botão de voltar da questão 2.
tests[2].addEventListener('onback', function (event) {
  
  // Verifica se a questão pode voltar.
  if (true) {
    // Volta uma questão no tester.
    tester.back();
  } else {
    alert('Você não pode voltar essa questão.');  
  }
});
```

## Pular questão
```js
var tests = tester.getTestsList();
// Evento disparado quando usuário clicar no botão de pular da questão 3.
tests[3].addEventListener('onskip', function (event) {
  
  // Verifica se a questão pode pular.
  if (true) {
    // Pula uma questão no tester.
    tester.skip();
  } else {
    alert('Você não pode pular essa questão.');  
  }
});
```

## Suporte na questão
```js
var tests = tester.getTestsList();
// Evento disparado quando usuário clicar no botão de suporte da questão 4.
tests[4].addEventListener('onsupport', function (event) {
  // Atende ao pedido de suporte para questão.  
});
```

## Finalizando

```js
var testerElement = document.querySelector('ul.ava-tester');
// Evento disparado quando usuário responder todas as questões.
testerElement.addEventListener('onend', function (event) {
  // Redireciona para resultado.
  window.location.href = './result.html';
});
```
