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
