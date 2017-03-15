# Introdução
O `timefield` é um componente para manipular campos de tempo.

# Como usar

Para adicionar um `timefield`, crie um elemento com a classe `ava-timefield`:

```html
<div class="ava-timefield"></div>
``` 

Em seguida, adicione o *input* do tipo *time* com a classe `ava-timefield__input`:

```html
<div class="ava-timefield">
  <input class="ava-timefield__input" type="time">
</div>
```

Adicione um *label* para o campo com a classe `ava-timefield__label`:

```html
<div class="ava-timefield">
  <input class="ava-timefield__input" type="time">
  <label class="ava-timefield__label">Tempo</label>
</div>
```

Complemente o *input* com um `id` e o *label* com o atributo `for`:

```html
<div class="ava-timefield">
  <input class="ava-timefield__input" type="time" id="time-field">
  <label class="ava-timefield__label" for="date-field">Tempo</label>
</div>
```


# Classes

Class | Efeito | Observação
------|--------|-----------
`ava-timefield` | Define um componente `timefield`. | Obrigatório
`ava-timefield__input` | Define o *input* do tipo `time`. | Obrigatório
`ava-timefield__label` | Define o *label* do tipo *input*. | Obrigatório

# Javascript API

Considere a instância do componente:

```js
var timefieldElement = document.querySelector('.ava-timefield');
var timefield = datefieldElement.AvaTimefield;
```

Método | Efeito | Parâmetros | Retorno
-------|--------|------------|--------
`create()` | Inicializa dinamicamente o campo. | | `undefined`
`clear()` | Define o valor do campo como vazio. | | `undefined`
`destroy()` | Destrói dinamicamente o campo. | | `undefined`
`update()` | Destrói e inicializa dinamicamente o campo. | | `undefined`
`setValue(value)` | Define o valor do campo de data no formato `hh:mm` (ou indicado no dataset `format`, por exemplo `data-format="hh:mm:ss"`) e atualiza o componente. | `string` | `undefined`

# Exemplo de uso

```js
var timefieldElement = document.querySelector('.ava-timefield');
var timefield = datefieldElement.AvaTimefield;
// Definindo a data dinamicamente.
timefield.setValue('05:15');
// Definindoo valor do campo como vazio.
timefield.clear();
```
