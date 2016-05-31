# Introdução
O `textfield` é um componente para manipular campos de texto.

# Como usar

Para adicionar um `textfield`, crie um elemento com a classe `ava-textfield`:

```html
<div class="ava-textfield"></div>
``` 

Em seguida, adicione o *input*  com a classe `ava-textfield__input`:

```html
<div class="ava-textfield">
  <input class="ava-textfield__input" type="text">
</div>
```

Adicione um *label* para o campo com a classe `ava-textfield__label`:

```html
<div class="ava-textfield">
  <input class="ava-textfield__input" type="text">
  <label class="ava-textfield__label">Texto</label>
</div>
```

Complemente o *input* com um `id` e o *label* com o atributo `for`:

```html
<div class="ava-textfield">
  <input class="ava-textfield__input" type="text" id="text-field">
  <label class="ava-textfield__label" for="text-field">Texto</label>
</div>
```


# Classes

Class | Efeito | Observação
------|--------|-----------
`ava-textfield` | Define um componente `textfield`. | Obrigatório
`ava-textfield__input` | Define o *input*. | Obrigatório
`ava-textfield__label` | Define o *label* do tipo *input*. | Obrigatório

# Javascript API

Considere a instância do componente:

```js
var textfieldElement = document.querySelector('.ava-textfield');
var textfield = textfieldElement.AvaTextfield;
```

Método | Efeito | Parâmetros | Retorno
-------|--------|------------|--------
`create()` | Inicializa dinamicamente o campo. | | `undefined`
`clear()` | Define o valor do campo como vazio. | | `undefined`
`destroy()` | Destrói dinamicamente o campo. | | `undefined`
`update()` | Destrói e inicializa dinamicamente o campo. | | `undefined`
`setValue(value)` | Define o valor do campo atualiza o componente. | `string` | `undefined`

# Exemplo de uso

```js
var textfieldElement = document.querySelector('.ava-textfield');
var textfield = textfieldElement.AvaTextfield;
// Atualiza dinamicamente o campo.
textfield.update();
// Define o valor do campo.
textfield.setValue('Texto aqui');
// Define o valor do campo como vazio.
textfield.clear();
```
