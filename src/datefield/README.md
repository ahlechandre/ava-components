# Introdução
O `datefield` é um componente para manipular campos de data. Esse componente prevê dois tipos de *inputs*: **padrão** ou **material**.

# Como usar

Para adicionar um `datefield`, crie um elemento com a classe `ava-datefield`:

```html
<div class="ava-datefield"></div>
``` 

Indique o modificador `ava-datefield--material` para inserir um campo com efeito **material design** (Materialize pickadate):

```html
<div class="ava-datefield ava-datefield--material"></div>
```  

Em seguida, adicione o *input* do tipo *date* com a classe `ava-datefield__input`:

```html
<div class="ava-datefield">
  <input class="ava-datefield__input" type="date">
</div>
```

Adicione um *label* para o campo com a classe `ava-datefield__label`:

```html
<div class="ava-datefield">
  <input class="ava-datefield__input" type="date">
  <label class="ava-datefield__label">Data</label>
</div>
```

Complemente o *input* com um `id` e o *label* com o atributo `for`:

```html
<div class="ava-datefield">
  <input class="ava-datefield__input" type="date" id="date-field">
  <label class="ava-datefield__label" for="date-field">Data</label>
</div>
```


# Classes

Class | Efeito | Observação
------|--------|-----------
`ava-datefield` | Define um componente `datefield`. | Obrigatório
`ava-datefield--material` | Define um componente `datefield` com efeito **material design**. | Opcional
`ava-datefield__input` | Define o *input* do tipo `date`. | Obrigatório
`ava-datefield__label` | Define o *label* do tipo *input*. | Obrigatório

# Javascript API

Considere a instância do componente:

```js
var datefieldElement = document.querySelector('.ava-datefield');
var datefield = datefieldElement.AvaDatefield;
```

Método | Efeito | Parâmetros | Retorno
-------|--------|------------|--------
`create()` | Inicializa dinamicamente o campo. | | `undefined`
`clear()` | Define o valor do campo como vazio. | | `undefined`
`destroy()` | Destrói dinamicamente o campo. | | `undefined`
`update()` | Destrói e inicializa dinamicamente o campo. | | `undefined`
`setValue(value)` | Define o valor do campo de data no formato `yyyy-mm-dd` e atualiza o componente. | `string` | `undefined`

# Exemplo de uso

```js
var datefieldElement = document.querySelector('.ava-datefield');
var datefield = datefieldElement.AvaDatefield;
// Definindo a data dinamicamente.
datefield.setValue('2010-12-01');
// Definindoo valor do campo como vazio.
datefield.clear();
```
