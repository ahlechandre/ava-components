# Introdução
O `selectfield` é um componente para alternar entre opções para entrada de dados.

# Como usar

Para adicionar um `selectfield`, crie um elemento com a classe `ava-selectfield`:

```html
<div class="ava-selectfield"></div>
``` 

Em seguida, adicione o *select*  com a classe `ava-selectfield__select`:

```html
<div class="ava-selectfield">
  <select class="ava-selectfield__select">
    <option value="1">1</option>
    <option value="2">2</option>
  </select>
</div>
```

Adicione um *label* para o campo com a classe `ava-selectfield__label`:

```html
<div class="ava-selectfield">
  <select class="ava-selectfield__select">
    <option value="1">1</option>
    <option value="2">2</option>
  </select>
  <label class="ava-selectfield__label">Selecione</label>
</div>
```

# Classes

Class | Efeito | Observação
------|--------|-----------
`ava-selectfield` | Define um componente `selectfield`. | Obrigatório
`ava-selectfield__select` | Define o *select*. | Obrigatório
`ava-selectfield__label` | Define o *label* do tipo *input*. | Obrigatório

# Javascript API

Considere a instância do componente:

```js
var selectfieldElement = document.querySelector('.ava-selectfield');
var selectfield = selectfieldElement.AvaSelectfield;
```

Método | Efeito | Parâmetros | Retorno
-------|--------|------------|--------
`create()` | Cria dinamicamente o componente. | | `undefined`
`destroy()` | Destrói dinamicamente o campo. | | `undefined`
`update()` | Destrói e inicializa dinamicamente o campo. | | `undefined`
`append(options)` | Adiciona (ao final) novas opções ao *select*. | `array` | `undefined`
`set(options)` | Remove todas antes de adicionar as novas opções ao *select*. | `array` | `undefined`
`remove(values)` | Remove todos os elementos `<option>` referentes aos valores passados como argumento. | `array` | `undefined`
`getValue()` | Retorna o valor atual do `select`. | | `string`
`select(value)` | Define o valor do elemento `select` atualiza o componente. | `string` | `undefined`

# Exemplo de uso

```js
var selectfieldElement = document.querySelector('.ava-selectfield');
var selectfield = selectfieldElement.AvaSelectfield;
// Destrói o componente.
selectfield.destroy();
// Cria o componente.
selectfield.create();
// Atualiza o componente (destrói + cria).
selectfield.update();
// Define o valor a ser selecionado.
selectfield.select('2');
// Retorna o valor selecionado.
selectfield.getValue(); // 2
```

# Adicionando novas opções dinamicamente

Para adicionar novas opções, basta usar o método `append(options)` ou `set(options)`.

O parâmetro `options` deve ser um `array` contendo o texto e os atributos de cada opção a ser adicionada, desta forma:

```js
var options = [
  {
    label: 'Option 1',
    attributes: {
      value: '1',
      selected: 'selected'
    },
  },
  {
    label: 'Option 2',
    attributes: {
      value: '2',
    },
  },
  {
    label: 'Option 3',
    attributes: {
      value: '3',
      id: 'option-3'
    },
  },
]
```

Essa configuração deve gerar os seguintes elementos:

```html
<option value="1" selected="selected">Option 1</option>
<option value="2">Option 2</option>
<option value="3" id="option-3">Option 3</option>
``` 

Agora, considere o seguinte `selectfield`:

```html
<div class="ava-selectfield">
  <select class="ava-selectfield__select">
    <option value="0">0</option>
    <option value="1">1</option>
    <option value="2">2</option>
  </select>
  <label class="ava-selectfield__label">My Select</label>
</div>
```

## append

Adicionando opções ao final:

```js
// Seleciona o elemento selectfield.
var selectfieldElement = document.querySelector('.ava-selectfield#my-selectfield');

// Acessa o componente.
var MySelectfield = selectfieldElement.AvaSelectfield;

// Adiciona virtualmente uma nova opção ao final do select.
MySelectfield.append([
  {
    label: 'New option',
    attributes: {
      value: 'new-option',
    },
  },
]);

// Atualiza o componente e renderiza a nova opção.
MySelectfield.update();
```

Após a operação de `append`, o `selectfield` deve estar assim:

```html
<div class="ava-selectfield">
  <select class="ava-selectfield__select">
    <option value="0">0</option>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="new-option">New option</option>
  </select>
  <label class="ava-selectfield__label">My Select</label>
</div>
```

## set

Definindo todas as opções:

```js
// Seleciona o elemento selectfield.
var selectfieldElement = document.querySelector('.ava-selectfield#my-selectfield');

// Acessa o componente.
var MySelectfield = selectfieldElement.AvaSelectfield;

// Remove todas as atuais opções e adiciona virtualmente as novas opções.
MySelectfield.set([
  {
    label: 'New option',
    attributes: {
      value: 'new-option',
    },
  },
  {
    label: 'New option 2',
    attributes: {
      value: 'new-option-2',
    },
  },
]);

// Atualiza o componente e renderiza a nova opção.
MySelectfield.update();
```

Após a operação de `set`, o `selectfield` deve estar assim:

```html
<div class="ava-selectfield">
  <select class="ava-selectfield__select">
    <option value="new-option">New option</option>
    <option value="new-option-2">New option 2</option>
  </select>
  <label class="ava-selectfield__label">My Select</label>
</div>
```
