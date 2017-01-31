# Introdução
O `collapsible` é um componente que possui uma lista de itens que se expandem quando clicados. 

# Como usar

Para adicionar um `collapsible`, crie um elemento com a classe `ava-collapsible`:

```html
<ul class="ava-collapsible"></ul>
``` 

Indique o modificador `ava-datefield--popout` para adicionar o efeito popout:

```html
<ul class="ava-collapsible ava-collapsible--popout"></ul>
```  

Indique o modificador `ava-datefield--accordion` para que apenas um item permaneça aberto por vez:

```html
<ul class="ava-collapsible ava-collapsible--popout ava-collapsible--accordion"></ul>
```

Adicione os itens do componente com a classe `ava-collapsible__item`:

```html
<ul class="ava-collapsible">
  <li class="ava-collapsible__item"></li>
  <li class="ava-collapsible__item"></li>
  <li class="ava-collapsible__item"></li>
  <li class="ava-collapsible__item"></li>
</ul>
```

Em seguida, adicione o `header`e o `body` de cada item:

```html
<ul class="ava-collapsible">
  <li class="ava-collapsible__item">
    <div class="collapsible-header ava-collapsible__header"></div>
    <div class="collapsible-body ava-collapsible__body"></div>
  </li>
</ul>
```

# Classes

Class | Efeito | Observação
------|--------|-----------
`ava-collapsible` | Define um componente `collapsible`. | Obrigatório
`ava-collapsible--popout` | Define um componente `datefield` com efeito popout. | Opcional
`ava-collapsible--accordion` | Define um componente `datefield` que expande um item por vez. | Opcional
`ava-collapsible__item` | Define um item do `collapsible`. | Obrigatório
`ava-collapsible__header` | Define o cabeçalho de um item do `collapsible`. | Obrigatório
`ava-collapsible__body` | Define o corpo de um item do `collapsible`. | Obrigatório

# Javascript API

Considere a instância do componente:

```js
var collapsibleElement = document.querySelector('.ava-collapsible');
var collapsible = collapsibleElement.AvaCollapsible;
```

Método | Efeito | Parâmetros | Retorno
-------|--------|------------|--------
`create()` | Inicializa dinamicamente o componente. Chamado automaticamente. | | `undefined`

# Exemplo de uso

```js
var collapsibleElement = document.querySelector('.ava-collapsible');
var collapsible = collapsibleElement.AvaCollapsible;
// Inicializando dinamicamente o componente.
collapsible.create();
```
